import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './services/telemetry.service';
import { Alert, AlertUser, TelemetryData, TelemetryParameterization } from './entities';
import { TelemetryGateway } from './telemetry.gateway';
import { User } from '../auth/entities/user.entity';

@Module({
  controllers: [TelemetryController],
  providers: [TelemetryService, TelemetryGateway],
  imports: [
    ConfigModule.forRoot(),

    SequelizeModule.forFeature([User, TelemetryData, TelemetryParameterization, Alert, AlertUser]),
  ],
})
export class TelemetryModule {}
