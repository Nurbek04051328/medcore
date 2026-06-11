import { ObservationStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";


export class CreateObservationDto {
  @IsString()
  patientId: string;

  @IsString()
  code: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsEnum(ObservationStatus)
  status?: ObservationStatus;

  @IsDateString()
  observedAt:  string;
}