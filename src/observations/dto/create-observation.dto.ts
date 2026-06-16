import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ObservationStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";


export class CreateObservationDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'blood-pressure' })
  @IsString()
  code: string;

  @ApiProperty({ example: '120/80' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ example: 'mmHg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 'FINAL', enum: ObservationStatus })
  @IsOptional()
  @IsEnum(ObservationStatus)
  status?: ObservationStatus;

  @ApiProperty({ example: '2025-06-11T08:00:00.000Z' })
  @IsDateString()
  observedAt:  string;
}