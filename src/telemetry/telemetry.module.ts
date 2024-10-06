import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './services/telemetry.service';
import { TelemetryData } from './entities/telemetry-data';
import { TelemetryGateway } from './telemetry.gateway';

@Module({
  controllers: [TelemetryController],
  providers: [TelemetryService, TelemetryGateway],
  imports: [
    ConfigModule.forRoot(),

    SequelizeModule.forFeature([TelemetryData]),
  ],
})
export class TelemetryModule {}
