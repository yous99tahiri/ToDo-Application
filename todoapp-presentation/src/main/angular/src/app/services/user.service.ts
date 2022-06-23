import { HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TodoItem } from '../entities/todo-item';
import { UserAccount } from '../entities/user-account';
import { SessionAuthService } from './session-auth.service';

@Injectable()
export class UserService {

  private _authService: SessionAuthService;
  //MAYBE NEEDED:
  private headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

  public set authService(value: SessionAuthService) {
    this._authService = value;
  }
  public get authService(): SessionAuthService {
    return this._authService;
  }
  constructor(authService:SessionAuthService) {
    console.log("UserService: created")
    this._authService = authService
  }

  deleteUserAccount(username:string): Observable<UserAccount> {
    console.log(`UserService: deleteUserAccount called for user '${username}'`)
    const params = {
      "username" : username
    }
    return this._authService.getHTTPClient().delete<any>(`${this._authService.getBaseUrl()}/user`, {headers: new HttpHeaders(),params : params}).pipe(
      map(body => UserAccount.fromObject(body))
    );
  }

  readUserAccount(): Observable<UserAccount> {
    console.log(`UserService: readUserAccount called `)
    return this._authService.getHTTPClient().get<any>(`${this._authService.getBaseUrl()}/user`, {headers: new HttpHeaders()}).pipe(
      map(body => UserAccount.fromObject(body))
    );
  }

  readAllUserNames(): Observable<string[]> {
    console.log(`UserService: readAllUserNames called`)
    return this._authService.getHTTPClient().get<string[]>(`${this._authService.getBaseUrl()}/user/all`, {headers: new HttpHeaders()}).pipe(
      map(body => {
        console.log("--------------")
        console.log("Received body on readAllUserNames:", body)
        console.log("Body as json:", JSON.stringify(body))
        console.log("typeof:", typeof(body))
        console.log("--------------")
        return body
      })
    );
  }

  readUserAssignedTodoItems(): Observable<TodoItem[]> {
    console.log(`ItemService: readUserAssignedTodoItems called`)
    return this._authService.getHTTPClient().get<TodoItem[]>(`${this._authService.getBaseUrl()}/user/items`, {headers: new HttpHeaders()}).pipe(
      map(body => {
        console.log("--------------")
        console.log("Received body on readUserAssignedTodoItems:", body)
        console.log("Body as json:", JSON.stringify(body))
        console.log("typeof:", typeof(body))
        console.log("--------------")
        return body.map(obj=> {return TodoItem.fromObject(obj)})
      })
    );
  }

  //updateUserAccount ?
}
