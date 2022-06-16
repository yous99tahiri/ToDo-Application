import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { UserAccount } from '../entities/user-account';

@Injectable()
export class SessionAuthService {
  private loggedIn: boolean = false;
  public username: string = "";

  constructor(private http: HttpClient) {
    console.log("SessionAuthService: created")
  }

  login(userAccount:UserAccount): Observable<boolean> {
    console.log(`SessionAuthService: login called for user '${userAccount.username}'`)
    this.username = userAccount.username
    const body = new HttpParams()
      .set('username', userAccount.username)
      .set('password', userAccount.password);

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(`/login.jsp`, body.toString(), {headers, responseType: 'text'}).pipe(
      map(() => {
        this.loggedIn = true;
        return true;
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
        this.loggedIn = false;
        return true;
      })
    );
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  getBaseUrl(): string {
    return `${env.apiUrl}/auth/session`
  }

  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  get _username(): string {
    return this.username;
  }
  set _username(value: string) {
    this.username = value;
  }
}
