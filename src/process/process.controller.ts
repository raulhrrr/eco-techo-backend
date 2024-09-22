import { Body, Controller, Post } from '@nestjs/common';
import { ProcessService } from './services/process.service';

@Controller('process')
export class ProcessController {
    constructor(private readonly processService: ProcessService) { }

    @Post('catch-data')
    async process(@Body() data: any): Promise<string> { // TODO: Remove any
        return await this.processService.process(data);
    }

}
