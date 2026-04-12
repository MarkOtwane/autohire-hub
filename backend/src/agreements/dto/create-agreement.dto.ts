import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateAgreementDto {
  @IsString()
  @IsNotEmpty()
  clientSubmissionId: string;

  @IsString()
  @IsNotEmpty()
  driverName: string;

  @IsEmail()
  driverEmail: string;

  @IsString()
  @IsNotEmpty()
  driverPhone: string;

  @IsString()
  @IsNotEmpty()
  driverIdNumber: string;

  @IsString()
  @IsNotEmpty()
  driverLicenseNumber: string;

  @IsString()
  @IsNotEmpty()
  emergencyContactName: string;

  @IsString()
  @IsNotEmpty()
  emergencyContactPhone: string;

  @IsString()
  @IsNotEmpty()
  vehicleName: string;

  @IsOptional()
  @IsString()
  vehiclePlateNumber?: string;

  @IsDateString()
  pickupDate: string;

  @IsDateString()
  returnDate: string;

  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @IsString()
  @IsNotEmpty()
  returnLocation: string;

  @IsBoolean()
  rentalTermsAccepted: boolean;

  @IsString()
  @Matches(/^data:image\/(png|jpeg);base64,/, {
    message: 'Signature must be a base64 PNG or JPEG data URL.',
  })
  signatureData: string;
}
