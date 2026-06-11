import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ObservationsService } from "../services/observations.service";
import { CreateObservationDto } from "../dto/create-observation.dto";


@Controller('observations')
@UseGuards(JwtAuthGuard)
export class ObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @Post()
  create(@Body() dto: CreateObservationDto) {
    return this.observationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.observationsService.findAll();
  }

  @Get(':id/fhir')
  findOneFhir(@Param('id') id: string) {
    return this.observationsService.findOneFhir(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.observationsService.findOne(id);
  }
}