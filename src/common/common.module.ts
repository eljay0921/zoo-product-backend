import { Module } from '@nestjs/common';
import { JwtModule } from './jwt/jwt.module';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  imports: [JwtModule],
  controllers: [CommonController],
  providers: [CommonService]
})
export class CommonModule {}
