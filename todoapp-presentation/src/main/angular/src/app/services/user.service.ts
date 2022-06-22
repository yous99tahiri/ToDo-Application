import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TodoItem } from '../entities/todo-item';
import { UserAccount } from '../entities/user-account';
import { SessionAuthService } from './session-auth.service';

@Injectable()
export class UserService {

  private _authService: SessionAuthService;

  public set authService(value: SessionAuthService) {
    this._authService = value;
  }
  public get authService(): SessionAuthService {
    return this._authService;
  }
  constructor(private http: HttpClient,authService:SessionAuthService) {
    console.log("UserService: created")
    this._authService = authService
  }

  deleteUserAccount(username:string): Observable<UserAccount> {
    console.log(`UserService: deleteUserAccount called for user '${username}'`)
    const params = {
      "username" : username
    }
    return this.http.delete<any>(`${this._authService.getBaseUrl()}/user`, {headers: new HttpHeaders(),params : params}).pipe(
      map(body => UserAccount.fromObject(body))
    );
  }

  readUserAccount(username:string): Observable<UserAccount> {
    console.log(`UserService: readUserAccount called for user '${username}'`)
    const params = {
      "username" : username
    }
    return this.http.get<any>(`${this._authService.getBaseUrl()}/user`, {headers: new HttpHeaders(),params : params}).pipe(
      map(body => UserAccount.fromObject(body))
    );
  }

  readAllUserNames(): Observable<string[]> {
    console.log(`UserService: readAllUserNames called`)
    return this.http.get<any>(`${this._authService.getBaseUrl()}/user/all`, {headers: new HttpHeaders()}).pipe(
      map(body => body.names )
    );
  }

  readUserAssignedTodoItems(username:string): Observable<TodoItem[]> {
    console.log(`ItemService: readUserAssignedTodoItems called for user '${username}'`)
    const params = {"username" : username}
    return this.http.get<any>(`${this._authService.getBaseUrl()}/user/items`, {headers: new HttpHeaders(),params : params}).pipe(
      map(body => body.items.map(obj=> {return TodoItem.fromObject(obj)}))
    );
  }

  //updateUserAccount ?
}
