import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { map } from 'rxjs/operators';
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
    console.log(`RegisterService: createUser called for user '${userAccount.username}'`)
    const url = `${env.apiUrl}/user`
    return this.http.post<any>(url, userAccount.toObject(), {headers: this.defaultHeaders}).pipe(
      map(body => UserAccount.fromObject(body))
    );
  }
}