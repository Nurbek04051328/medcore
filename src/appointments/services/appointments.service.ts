import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAppointmentDto } from "../dto/create-appointment.dto";
import { toFhirAppointment } from "../fhir/appointment.fhir";
import { UpdateAppointmentStatusDto } from "../dto/update-appointment-status.dto";


@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId }
    });

    if(!patient) {
      throw new NotFoundException("Patient not found");
    }

    const doctor = await this.prisma.user.findUnique({
      where: { id: dto.doctorId }
    })

    if(!doctor || doctor.role !== 'DOCTOR') {
      throw new BadRequestException("Doctor not found or user is not doctor")
    }

    return this.prisma.appointment.create({
      data: {
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        reason: dto.reason,
      },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if(!appointment) {
      throw new NotFoundException("Appointment not fount");
    }

    return appointment;
  }

  async findOneFhir(id: string) {
    const appointment = await this.findOne(id);
    return toFhirAppointment(appointment);
  }

  async updateStatus(id: string, dto: UpdateAppointmentStatusDto) {
    await this.findOne(id);

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.appointment.delete({
      where: { id },
    });

    return {
      message: "Appointment deleted succesfully"
    }
  }
}