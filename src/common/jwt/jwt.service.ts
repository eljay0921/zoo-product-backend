import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
    sign(payload: string): string {
        return jwt.sign(payload, 'secret-temp-value');
    }
}
