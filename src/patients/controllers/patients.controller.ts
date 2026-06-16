import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PatientsService } from '../services/patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() dto: CreatePatientDto) {
    return this.patientsService.create(dto);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id/fhir')
  findOneFhir(@Param('id') id: string) {
    return this.patientsService.findOneFhir(id);
  }

  @Get(':id/medical-history')
  getMedicalHistory(@Param('id') id: string) {
    return this.patientsService.getMedicalHistory(id);
  }

  @Get(':id/medical-history/fhir')
  getMedicalHistoryFhir(@Param('id') id: string) {
    return this.patientsService.getMedicalHistoryFhir(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id)
  }
}
