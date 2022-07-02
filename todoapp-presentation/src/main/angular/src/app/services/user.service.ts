import { HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { TodoItem } from '../entities/todo-item';
import { UserAccount } from '../entities/user-account';
import { SessionAuthService } from './session-auth.service';

@Injectable()
export class UserService {

  constructor( private authService:SessionAuthService) {
    //console.log("UserService: created")
    //console.log("UserService: authService null | undefined?", this.authService == null || this.authService == undefined)
  }

  deleteUserAccount(username:string): Observable<UserAccount> {
    //console.log(`UserService: deleteUserAccount called for user '${username}'`)
    const params = {
      "username" : username
    }
    return this.authService.getHTTPClient().delete<any>(`${this.authService.getBaseUrl()}/profile/auth`, {headers: new HttpHeaders(),params : params}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        //console.log(`UserService: deleteUserAccount response`, body)
        return UserAccount.fromObject(body)})
    );
  }

  readUserAccount(): Observable<UserAccount> {
    //console.log(`UserService: readUserAccount called `)
    return this.authService.getHTTPClient().get<any>(`${this.authService.getBaseUrl()}/profile/auth`, {headers: new HttpHeaders()}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        //console.log(`UserService: readUserAccount response`, body)
        return UserAccount.fromObject(body)})
    );
  }

  readAllUserNames(): Observable<string[][]> {
    //console.log(`UserService: readAllUserNames called`)
    return this.authService.getHTTPClient().get<string[][]>(`${this.authService.getBaseUrl()}/profile/auth/all`, {headers: new HttpHeaders()}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        //console.log(`UserService: readAllUserNames response`, body)
        return body//.filter( s => s instanceof String)
      })
    );
  }

  readUserAssignedTodoItems(): Observable<TodoItem[]> {
    //console.log(`UserService: readUserAssignedTodoItems called`)
    return this.authService.getHTTPClient().get<any[]>(`${this.authService.getBaseUrl()}/profile/auth/items`, {headers: new HttpHeaders()}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        //console.log(`UserService: readUserAssignedTodoItems response`, body)
        return body.map(obj=> {return TodoItem.fromObject(obj)})
      })
    );
  }

  //updateUserAccount ?
}
