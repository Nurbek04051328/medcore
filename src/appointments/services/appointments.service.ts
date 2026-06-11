import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAppointmentDto } from "../dto/create-appointment.dto";
import { toFhirAppointment } from "../fhir/appointment.fhir";
import { UpdateAppointmentStatusDto } from "../dto/update-appointment-status.dto";
import { AppointmentStatus } from "@prisma/client";
import { DoctorScheduleQueryDto } from "../dto/doctor-schedule-query.dto";


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

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    const conflictAppointment = 
      await this.prisma.appointment.findFirst({
        where: {
          doctorId: dto.doctorId,

          status: {
            not: 'CANCELLED',
          },
          AND: [
            {
              startTime: {
                lt: endTime
              },
            },
            {
              endTime: {
                gt: startTime
              },
            },
          ],
        },
      });

    if(conflictAppointment) {
      throw new BadRequestException("Doctor already has an appointment at this time")
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

  async findAll() {
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

  async getDoctorSchedule(
    doctorId: string, 
    query: DoctorScheduleQueryDto,
  ) {
    const { date, status, page = 1, limit = 10 } = query;

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
    });

    if(!doctor || doctor.role !== 'DOCTOR') {
      throw new NotFoundException('Doctor not found');
    }

    const where: any = { doctorId }

    if(date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);

      where.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      }
    }

    if(status) {
      where.status = status;
    }

    const skip = (page-1) * limit
    
    const [items, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'asc' },
        include: {
          patient: true,
          doctor: {
            select: {
              id: true,
              email: true,
              role: true
            },
          },
        },
      }),

      this.prisma.appointment.count({ where }),
    ])

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
}