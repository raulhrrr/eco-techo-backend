import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from './auth/auth.module';
import { sequelizeConfig } from './config/sequelize.config';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot(sequelizeConfig),

    AuthModule,
    TelemetryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
