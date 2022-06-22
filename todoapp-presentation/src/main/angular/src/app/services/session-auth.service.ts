import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { UserAccount } from '../entities/user-account';
import { environment as env } from 'src/environments/environment';
@Injectable()
export class SessionAuthService {
  private loggedIn: boolean = false;
  private username: string = "";
  private uuid:string = "";
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

  readProfile(): Observable<string>{
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.get(`${this.getBaseUrl()}/profile`, {headers, responseType: 'text'}).pipe(
      map((obj) => {
        this.uuid = `${obj}`;
        return obj;
      }
      )
    )
  }

  logout(): Observable<boolean> {
    console.log(`SessionAuthService: logout called`)
    return this.http.get(`/logout`).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(() => {
        this.username = "";
        this.uuid = "";
        this.loggedIn = false;
        return true;
      })
    );
  }

  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUsername(): string {
    return this.username;
  }

  getUUID(): string {
    return this.uuid;
  }

  getBaseUrl(): string {
    return `${env.apiUrl}`
  }
}
