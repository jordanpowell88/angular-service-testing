import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class CountService {
  constructor(private readonly http: HttpClient) { }

  getCount(): Observable<number> {
    return this.http.get<{ count: number }>('/count').pipe(
      map((response) => response.count),
      catchError((err: HttpResponse<any>) =>
        throwError(err.status)
      )
    )
  }

  getDoubleCount(value: number): Observable<number> {
    return this.http.get<{ count: number }>('/doubleCount').pipe(
      map(() => value * 2),
      catchError((err: HttpResponse<any>) =>
        throwError(err.status)
      )
    )
  }
}
