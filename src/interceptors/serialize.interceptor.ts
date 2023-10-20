import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";


// interface ClassConstructor {
//   new (...args: any): {}
// }

type ClassConstructor = new (...args: any) => {}

// Custom Decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

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