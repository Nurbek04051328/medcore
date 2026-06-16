import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AppointmentsService } from "../services/appointments.service";
import { CreateAppointmentDto } from "../dto/create-appointment.dto";
import { UpdateAppointmentStatusDto } from "../dto/update-appointment-status.dto";
import { AppointmentStatus } from "@prisma/client";
import { DoctorScheduleQueryDto } from "../dto/doctor-schedule-query.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";


@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id/fhir')
  findOneFhir(@Param('id') id: string) {
    return this.appointmentsService.findOneFhir(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return  this.appointmentsService.updateStatus(id, dto);
  }

  @Get('doctor/:doctorId/schedule')
  getDoctorSchedule(
    @Param('doctorId') doctorId: string,
    @Query() query: DoctorScheduleQueryDto 
  ) {
    return this.appointmentsService.getDoctorSchedule(
      doctorId, 
      query
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}