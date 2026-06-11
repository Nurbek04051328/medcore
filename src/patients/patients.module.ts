
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})

export class PatientsModule {}