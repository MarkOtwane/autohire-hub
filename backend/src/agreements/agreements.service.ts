/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { NotificationsService } from '../notification/notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import PDFDocument = require('pdfkit');

interface AgreementPdfContext {
  agreementId: string;
  createdAt: Date;
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  driverIdNumber: string;
  driverLicenseNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  vehicleName: string;
  vehiclePlateNumber: string | null;
  pickupDate: Date;
  returnDate: Date;
  pickupLocation: string;
  returnLocation: string;
  signatureData: string;
}

@Injectable()
export class AgreementsService {
  private readonly logger = new Logger(AgreementsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async createAgreement(dto: CreateAgreementDto) {
    this.validateBusinessRules(dto);

    try {
      const year = new Date().getFullYear();

      await this.prisma.agreementCounter.upsert({
        where: { year },
        update: {},
        create: { year, currentValue: 0 },
      });

      const counter = await this.prisma.agreementCounter.update({
        where: { year },
        data: { currentValue: { increment: 1 } },
      });

      const agreementId = `RENT-${year}-${String(counter.currentValue).padStart(4, '0')}`;
      const downloadToken = randomUUID();

      const result = await this.prisma.rentalAgreement.create({
        data: {
          agreementId,
          clientSubmissionId: dto.clientSubmissionId,
          downloadToken,
          driverName: dto.driverName,
          driverEmail: dto.driverEmail,
          driverPhone: dto.driverPhone,
          driverIdNumber: dto.driverIdNumber,
          driverLicenseNumber: dto.driverLicenseNumber,
          emergencyContactName: dto.emergencyContactName,
          emergencyContactPhone: dto.emergencyContactPhone,
          vehicleName: dto.vehicleName,
          vehiclePlateNumber: dto.vehiclePlateNumber,
          pickupDate: new Date(dto.pickupDate),
          returnDate: new Date(dto.returnDate),
          pickupLocation: dto.pickupLocation,
          returnLocation: dto.returnLocation,
          rentalTermsAccepted: dto.rentalTermsAccepted,
          signatureData: dto.signatureData,
        },
      });

      const pdfBuffer = await this.generateAgreementPdf({
        agreementId: result.agreementId,
        createdAt: result.createdAt,
        driverName: result.driverName,
        driverEmail: result.driverEmail,
        driverPhone: result.driverPhone,
        driverIdNumber: result.driverIdNumber,
        driverLicenseNumber: result.driverLicenseNumber,
        emergencyContactName: result.emergencyContactName,
        emergencyContactPhone: result.emergencyContactPhone,
        vehicleName: result.vehicleName,
        vehiclePlateNumber: result.vehiclePlateNumber,
        pickupDate: result.pickupDate,
        returnDate: result.returnDate,
        pickupLocation: result.pickupLocation,
        returnLocation: result.returnLocation,
        signatureData: result.signatureData,
      });

      await this.notifications.sendAgreementSubmittedEmails({
        agreementId: result.agreementId,
        driverEmail: result.driverEmail,
        driverName: result.driverName,
        adminEmail:
          process.env.AGREEMENT_ADMIN_EMAIL || process.env.MAIL_USER || '',
        pdfBuffer,
      });

      return {
        success: true,
        agreementId: result.agreementId,
        createdAt: result.createdAt,
        downloadUrl: `/api/agreements/${result.agreementId}/pdf?token=${result.downloadToken}`,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const existing = await this.prisma.rentalAgreement.findUnique({
          where: { clientSubmissionId: dto.clientSubmissionId },
        });

        if (existing) {
          return {
            success: true,
            duplicated: true,
            agreementId: existing.agreementId,
            createdAt: existing.createdAt,
            downloadUrl: `/api/agreements/${existing.agreementId}/pdf?token=${existing.downloadToken}`,
          };
        }
      }

      this.logger.error(
        `Agreement creation failed for submission ${dto.clientSubmissionId}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException('Failed to submit agreement.');
    }
  }

  async getAgreementPdf(agreementId: string, token: string) {
    if (!token) {
      throw new BadRequestException('Download token is required.');
    }

    const agreement = await this.prisma.rentalAgreement.findUnique({
      where: { agreementId },
    });

    if (!agreement || agreement.downloadToken !== token) {
      throw new BadRequestException('Invalid agreement download request.');
    }

    return this.generateAgreementPdf({
      agreementId: agreement.agreementId,
      createdAt: agreement.createdAt,
      driverName: agreement.driverName,
      driverEmail: agreement.driverEmail,
      driverPhone: agreement.driverPhone,
      driverIdNumber: agreement.driverIdNumber,
      driverLicenseNumber: agreement.driverLicenseNumber,
      emergencyContactName: agreement.emergencyContactName,
      emergencyContactPhone: agreement.emergencyContactPhone,
      vehicleName: agreement.vehicleName,
      vehiclePlateNumber: agreement.vehiclePlateNumber,
      pickupDate: agreement.pickupDate,
      returnDate: agreement.returnDate,
      pickupLocation: agreement.pickupLocation,
      returnLocation: agreement.returnLocation,
      signatureData: agreement.signatureData,
    });
  }

  private validateBusinessRules(dto: CreateAgreementDto) {
    const pickup = new Date(dto.pickupDate);
    const dropoff = new Date(dto.returnDate);

    if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
      throw new BadRequestException('Invalid pickup or return date.');
    }

    if (dropoff <= pickup) {
      throw new BadRequestException('Return date must be after pickup date.');
    }

    if (!dto.rentalTermsAccepted) {
      throw new BadRequestException(
        'Rental terms must be accepted before submission.',
      );
    }
  }

  private generateAgreementPdf(data: AgreementPdfContext): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 48 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).text('Car Rental Agreement', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(11).text(`Agreement ID: ${data.agreementId}`);
      doc.text(`Date: ${data.createdAt.toISOString().slice(0, 10)}`);

      doc.moveDown(1);
      doc.fontSize(13).text('Driver Details', { underline: true });
      doc.fontSize(11);
      doc.text(`Name: ${data.driverName}`);
      doc.text(`Email: ${data.driverEmail}`);
      doc.text(`Phone: ${data.driverPhone}`);
      doc.text(`ID Number: ${data.driverIdNumber}`);
      doc.text(`License Number: ${data.driverLicenseNumber}`);
      doc.text(
        `Emergency Contact: ${data.emergencyContactName} (${data.emergencyContactPhone})`,
      );

      doc.moveDown(1);
      doc.fontSize(13).text('Rental Details', { underline: true });
      doc.fontSize(11);
      doc.text(`Vehicle: ${data.vehicleName}`);
      if (data.vehiclePlateNumber) {
        doc.text(`Plate Number: ${data.vehiclePlateNumber}`);
      }
      doc.text(`Pickup Date: ${data.pickupDate.toISOString().slice(0, 10)}`);
      doc.text(`Return Date: ${data.returnDate.toISOString().slice(0, 10)}`);
      doc.text(`Pickup Location: ${data.pickupLocation}`);
      doc.text(`Return Location: ${data.returnLocation}`);

      doc.moveDown(1);
      doc.fontSize(13).text('Signature', { underline: true });
      doc.fontSize(10).text('Signed digitally by the driver:');

      const base64 = data.signatureData.split(',')[1] || '';
      if (base64) {
        try {
          const signatureBuffer = Buffer.from(base64, 'base64');
          doc.moveDown(0.3);
          doc.image(signatureBuffer, { fit: [240, 90] });
        } catch (error) {
          this.logger.warn(
            `Skipping signature image in PDF for agreement ${data.agreementId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
          doc.moveDown(0.3);
          doc
            .fontSize(10)
            .fillColor('#7f1d1d')
            .text(
              'Signature image could not be rendered. Raw signature data is still stored securely.',
            )
            .fillColor('#000000');
        }
      }

      doc.moveDown(1.5);
      doc
        .fontSize(10)
        .fillColor('#444444')
        .text(
          'This document was generated electronically and is valid without a wet signature.',
        );

      doc.end();
    });
  }
}
