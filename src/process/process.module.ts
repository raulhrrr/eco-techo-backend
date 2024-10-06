import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { ProcessController } from './process.controller';
import { ProcessService } from './services/process.service';
import { TelemetricData } from './entities/telemetric-data.entity';
import { ProcessGateway } from './process.gateway';

@Module({
  controllers: [ProcessController],
  providers: [ProcessService, ProcessGateway],
  imports: [
    ConfigModule.forRoot(),

    SequelizeModule.forFeature([TelemetricData]),
  ],
})
export class ProcessModule {}
