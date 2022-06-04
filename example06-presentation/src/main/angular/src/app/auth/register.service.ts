import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { NewAccount } from './register/new-account';

@Injectable()
export class RegisterService {

  protected defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(protected http: HttpClient) {}

  create(username: string, password: string): Observable<NewAccount> {
    return this.http.post<any>(`${env.apiUrl}/register`, {username, password}, {headers: this.defaultHeaders}).pipe(
      map(body => NewAccount.fromObject(body))
    );
  }
}