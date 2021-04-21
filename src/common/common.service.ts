import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
    async checkUser(id:string, pw:string): Promise<boolean> {
        return true;
    }
}
