import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { NewUserAccount } from '../components/register/new-user-account';

@Injectable()
export class RegisterService {

  private defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  create(username: string, password: string): Observable<NewUserAccount> {
    return this.http.post<any>(`${env.apiUrl}/register`, {username, password}, {headers: this.defaultHeaders}).pipe(
      map(body => NewUserAccount.fromObject(body))
    );
  }
}