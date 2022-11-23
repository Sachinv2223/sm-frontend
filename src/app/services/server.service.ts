import { Status } from './../enums/status.enum';
import { Server } from './../interface/server';
import { CustomeResponse } from './../interface/custom-response';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  apiUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  //TODO Procedural approach
  // getServers(): Observable<CustomeResponse> {
  //   return this.http.get<CustomeResponse>(`http://localhost:8080/server/list`);
  // }

  //TODO Reactive Approach
  servers$ = <Observable<CustomeResponse>>this.http.get(`${this.apiUrl}/server/list`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  save$ = (server: Server) => <Observable<CustomeResponse>>this.http.post(`${this.apiUrl}/server/save`, server)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  ping$ = (ipAddress: string) => <Observable<CustomeResponse>>this.http.get(`${this.apiUrl}/server/ping/${ipAddress}`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  filter$ = (status: Status, response: CustomeResponse) => <Observable<CustomeResponse>>
    new Observable<CustomeResponse>(
      (observer) => {
        console.log(response);
        observer.next(
          status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status` } :
            {
              ...response,
              message:
                (response.data.servers && response.data.servers.filter(server => server.status === status).length > 0)
                  ? `Servers filtered by ${status === Status.SERVER_UP ? `SERVER UP` : `SERVER DOWN`} status`
                  : `No Servers of ${status === Status.SERVER_UP ? `SERVER UP` : `SERVER DOWN`} status found`,
              data: { servers: (response.data.servers) ? response.data.servers.filter(server => server.status === status) : undefined }
            }
        );
        observer.complete();
      }
    )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  delete$ = (serverId: number) => <Observable<CustomeResponse>>this.http.delete(`${this.apiUrl}/server/delete/${serverId}`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  private handleError(err: HttpErrorResponse): Observable<never> {
    console.log(err);
    return throwError(() => `Error Occured - Error code : ${err.status}`);
  }
}
