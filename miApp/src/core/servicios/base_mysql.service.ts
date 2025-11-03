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
    console.log('🔍 ERROR COMPLETO:', error);
    console.log('🔍 ERROR BODY:', error.error);
    console.log('🔍 ERROR ERRORS:', error.error?.errors);
    
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const serverMsg = error.error?.message || error.message;
      errorMessage = `Código: ${error.status}\nMensaje: ${serverMsg}`;
    }
    
    console.error('API error:', errorMessage);
    return throwError(() => new Error(errorMessage));
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
