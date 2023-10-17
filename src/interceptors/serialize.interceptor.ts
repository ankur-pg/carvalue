import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
      // Run something before request is handled
      console.log('In the Interceptor')

      return handler.handle().pipe(
        map((data: any) => {
          // Run something before response is sent out
          return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true
          })
        })
      )
  }
}