import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";


export class CreateAppointmentDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'doctor-uuid' })
  @IsString()
  doctorId: string;

  @ApiProperty({ example: '2025-06-12T09:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-06-12T09:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({ example: 'Initial consultation' })
  @IsOptional()
  @IsString()
  reason?: string;
}