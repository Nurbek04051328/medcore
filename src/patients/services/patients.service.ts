import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { toFhirPatient } from '../fhir/patient.fhir';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { toFhirAppointment } from 'src/appointments/fhir/appointment.fhir';
import { toFhirObservation } from 'src/observations/fhir/observation.fhir';

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

  async getMedicalHistory(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: {
            startTime: 'desc'
          },
          include: {
            doctor: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
        observations: {
          orderBy: {
            observedAt: 'desc',
          },
        },
      },
    });

    if(!patient) {
      throw new NotFoundException("Patient not found");
    }

    return patient;
  }

  async getMedicalHistoryFhir(id: string) {
    const patient = await this.getMedicalHistory(id);

    return {
      resourceType: "Bundle",
      type: 'collection',
      entry: [
        {
          resource: toFhirPatient(patient),
        },
        ...patient.appointments.map((appointment) => ({
          resource: toFhirAppointment({
            ...appointment,
            patient,
          }),
        })),
        ...patient.observations.map((observation) => ({
          resource: toFhirObservation({
            ...observation,
            patient,
          }),
        })),
      ],
    };
  }
}
