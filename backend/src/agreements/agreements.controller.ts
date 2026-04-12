import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AgreementsService } from './agreements.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';

@Controller('api/agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  createAgreement(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateAgreementDto,
  ) {
    return this.agreementsService.createAgreement(dto);
  }

  @Get(':agreementId/pdf')
  @Header('Content-Type', 'application/pdf')
  async getAgreementPdf(
    @Param('agreementId') agreementId: string,
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    const pdf = await this.agreementsService.getAgreementPdf(
      agreementId,
      token,
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${agreementId}.pdf"`,
    );
    res.send(pdf);
  }
}
