import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseMysqlService {
  protected baseUrl = environment.apiUrls.base;

  constructor(protected http: HttpClient) { }

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Accept': 'application/json' //descomentar si el backend lo requiere
    });
  }
  protected handleError(error: HttpErrorResponse) {
    console.log('ERROR COMPLETO:', error);
    console.log('ERROR STATUS:', error.status);
    console.log('ERROR BODY:', error.error);
    
    if (error.status === 0) {
      return throwError(() => ({
        status: 0,
        message: 'Error de conexión con el servidor',
        error: error.error
      }));
    }
    
    return throwError(() => error);
  }

  protected get<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    return this.http.get<T>(url, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    return this.http.post<T>(url, data, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    return this.http.put<T>(url, data, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  protected delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    return this.http.delete<T>(url, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }
}
