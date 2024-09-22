import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessService {

    async process(data: any): Promise<string> {
        console.log(data);
        return 'Processed';
    }

}
