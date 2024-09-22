import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProcessController } from './process.controller';
import { ProcessService } from './services/process.service';

@Module({
  controllers: [ProcessController],
  providers: [ProcessService],
  imports: [
    ConfigModule.forRoot(),
  ]
})
export class ProcessModule {}
