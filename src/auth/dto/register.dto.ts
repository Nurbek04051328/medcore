import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";


export class registerDto {
  @ApiProperty({ example: 'admin@mail.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'DOCTOR', enum: Role })
  @IsEnum(Role)
  role: Role;
}
