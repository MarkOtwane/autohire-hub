/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, FuelType } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { SearchVehicleDto } from './dto/search-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleCalendarQueryDto } from './dto/vehicle-calendar-query.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async uploadImage(file: Express.Multer.File) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException(
        'Cloudinary is not configured on the server',
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'car-rental-app/vehicles',
            resource_type: 'image',
          },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error ?? new Error('Image upload failed'));
              return;
            }

            resolve({ secure_url: uploadResult.secure_url });
          },
        );

        uploadStream.end(file.buffer);
      },
    );

    return { url: result.secure_url };
  }

  async create(dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        ...dto,
        category: dto.category as any,
        fuelType: FuelType[dto.fuelType],
      },
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany();
  }

  async findOne(id: string) {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateVehicleDto) {
    return this.prisma.vehicle.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.vehicle.delete({ where: { id } });
  }

  async search(dto: SearchVehicleDto) {
    if (
      dto.minPricePerDay !== undefined &&
      dto.maxPricePerDay !== undefined &&
      dto.minPricePerDay > dto.maxPricePerDay
    ) {
      throw new BadRequestException(
        'minPricePerDay cannot be greater than maxPricePerDay',
      );
    }

    return this.prisma.vehicle.findMany({
      where: {
        AND: [
          dto.location
            ? { location: { contains: dto.location, mode: 'insensitive' } }
            : {},
          dto.category
            ? { category: { equals: dto.category as any } } // or as string
            : {},
          dto.fuelType ? { fuelType: { equals: dto.fuelType } } : {},
          dto.transmission
            ? {
                transmission: {
                  contains: dto.transmission,
                  mode: 'insensitive',
                },
              }
            : {},
          dto.minPricePerDay !== undefined
            ? { pricePerDay: { gte: dto.minPricePerDay } }
            : {},
          dto.maxPricePerDay !== undefined
            ? { pricePerDay: { lte: dto.maxPricePerDay } }
            : {},
          dto.availableOnly ? { availability: true } : {},
          dto.keyword
            ? {
                OR: [
                  { name: { contains: dto.keyword, mode: 'insensitive' } },
                  {
                    description: { contains: dto.keyword, mode: 'insensitive' },
                  },
                ],
              }
            : {},
        ],
      },
    });
  }

  async getAvailabilityCalendar(
    vehicleId: string,
    query: VehicleCalendarQueryDto,
  ) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true, availability: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const from = query.from ? new Date(query.from) : new Date();
    const to = query.to
      ? new Date(query.to)
      : new Date(from.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new BadRequestException('Invalid calendar date range');
    }

    if (to <= from) {
      throw new BadRequestException(
        'Calendar end date must be after start date',
      );
    }

    const blockedSlots = await this.prisma.booking.findMany({
      where: {
        vehicleId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        pickupDate: { lt: to },
        dropoffDate: { gt: from },
      },
      select: {
        id: true,
        pickupDate: true,
        dropoffDate: true,
        status: true,
      },
      orderBy: { pickupDate: 'asc' },
    });

    return {
      vehicleId,
      from,
      to,
      isCurrentlyAvailable: vehicle.availability,
      blockedSlots: blockedSlots.map((slot) => ({
        bookingId: slot.id,
        pickupDate: slot.pickupDate,
        dropoffDate: slot.dropoffDate,
        status: slot.status,
      })),
    };
  }
}
