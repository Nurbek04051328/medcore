import { Module } from "@nestjs/common";
import { ObservationsController } from "./controllers/observations.controller";
import { ObservationsService } from "./services/observations.service";



@Module({
  controllers: [ObservationsController],
  providers: [ObservationsService],
  exports: [ObservationsService],
})

export class ObservationsModule {}