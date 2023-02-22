import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// any class you give me, Im gonna be happy.
interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// implements mesle interface mimome. etminan mide methodhaii ke dar NestInterceptor hast dar in class ma ham bashe.
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler.

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out.
        return plainToClass(this.dto, data, {
          // making sure everything works as expected.
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
