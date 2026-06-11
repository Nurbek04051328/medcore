import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { toFhirPatient } from '../fhir/patient.fhir';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePatientDto) {
    return this.prisma.patient.create({
      data: {
        ...dto,
        birthDate: new Date(dto.birthDate),
      },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany();
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if(!patient) {
      throw new NotFoundException("Patient not found");
    }

    return patient
  }

  async findOneFhir(id: string) {
    const patient = await this.findOne(id);
    return toFhirPatient(patient);
  }

  async update(id: string, dto: UpdatePatientDto) {
    await this.findOne(id);

    return this.prisma.patient.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.patient.delete({
      where: { id },
    });

    return {
      message: "Patient deleted succesfully",
    };
  }
}
