import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
// CanActivate 인터페이스는 return true를 하면 request를 진행시키고, false를 하면 요청이 거부된다.
export class DatabaseGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const dbName = context.switchToHttp().getRequest().dbname;
    return Boolean(dbName);
  }
}
