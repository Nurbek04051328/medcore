import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateObservationDto } from "../dto/create-observation.dto";
import { toFhirObservation } from "../fhir/observation.fhir";


@Injectable()
export class ObservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create (dto: CreateObservationDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId },
    });

    if(!patient) {
      throw new NotFoundException("Patient not found");
    }

    return this.prisma.observation.create({
      data: {
        patientId: dto.patientId,
        code: dto.code,
        value: dto.value,
        unit: dto.unit,
        status: dto.status,
        observedAt: new Date(dto.observedAt),
      },
      include: {
        patient: true,
      },
    });
  }

  findAll() {
    return this.prisma.observation.findMany({
      include: { patient: true },
      orderBy: { observedAt: 'desc' },
    });
  }

  async findOne(id:string) {
    const observation = await this.prisma.observation.findUnique({
      where: { id },
      include: { patient: true },
    });

    if(!observation) {
      throw new NotFoundException("Observation not found");
    }

    return observation;
  }

  async findOneFhir(id: string) {
    const observation = await this.findOne(id);
    return toFhirObservation(observation);
  }
}