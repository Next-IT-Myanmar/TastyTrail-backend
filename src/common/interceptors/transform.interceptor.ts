import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // Check if the response is already in the correct format
        if (data && typeof data === 'object' && 'data' in data && 'message' in data) {
          return data;
        }

        // If pagination data is present in the response
        const paginationData = data?.pagination;
        const responseData = paginationData ? data.results : data;

        return {
          data: responseData,
          pagination: paginationData,
          message: 'Operation completed successfully'
        };
      }),
    );
  }
}