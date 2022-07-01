import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { UserAccount } from '../entities/user-account';

@Injectable()
export class RegisterService {

  private defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {
    console.log("RegisterService: created")
  }

  createAccount(userAccount: UserAccount): Observable<UserAccount> {
    console.log(`RegisterService: createUser called for user `, userAccount)
    const url = `${env.apiUrl}/user`
    return this.http.post<any>(url, userAccount.toObject(), {headers: this.defaultHeaders}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        console.log(`RegisterService: createUser response `, body)
        return UserAccount.fromObject(body)})
    );
  }
}