import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";


export class CreatePatientDto {
  @ApiProperty({ example: 'Ali'})
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Karimov' })
  @IsString()
  lastName: string

  @ApiProperty({ example: '1995-01-15' })
  @IsDateString()
  birthDate: string

  @ApiProperty({ example: 'MALE', enum: Gender })
  @IsEnum(Gender)
  gender: Gender

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string
}

