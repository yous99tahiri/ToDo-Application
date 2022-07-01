import {  Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { UserAccount } from '../entities/user-account';
import { environment as env } from 'src/environments/environment';

@Injectable()
export class SessionAuthService {
  private _loggedIn: boolean = false;
  
  public get loggedIn(): boolean {
    return this._loggedIn;
  }


  constructor(private http: HttpClient) {
    console.log("SessionAuthService: created")
    console.log("SessionAuthService: http null | undefined?", this.http == null || this.http == undefined)
  }

  login(userAccount:UserAccount): Observable<boolean> {
    console.log(`SessionAuthService: login called`)
    const body = new HttpParams()
      .set('username', userAccount.username)
      .set('password', userAccount.password);

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(`/login.jsp`, body.toString(), {headers, responseType: 'text'}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(() => {
        this._loggedIn = true;
        return this._loggedIn;
      })
    );
  }

  logout(): Observable<boolean> {
    console.log(`SessionAuthService: logout called`)
    return this.http.get(`/logout`).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(() => {
        this._loggedIn = false;
        return this._loggedIn;
      })
    );
  }

  getIsLoggedIn():Observable<boolean>{
    console.log(`SessionAuthService: getIsLoggedIn called. isLoggedIn: ${this._loggedIn}`)
    return of(this._loggedIn);
  }

  getHTTPClient(): HttpClient {
    return this.http;
  }

  getBaseUrl(): string {
    return `${env.apiUrl}`
  }
}
