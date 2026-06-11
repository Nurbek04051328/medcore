import { Gender } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";


export class CreatePatientDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsDateString()
  birthDate: string

  @IsEnum(Gender)
  gender: Gender

  @IsOptional()
  @IsString()
  phone?: string
}

