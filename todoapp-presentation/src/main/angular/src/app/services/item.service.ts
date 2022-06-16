import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { TodoItem } from '../entities/todo-item';
import { TodoItemList } from '../entities/todo-item-list';
import { SessionAuthService } from './session-auth.service';

@Injectable()
export class ItemService {

  private _authService: SessionAuthService;
  
  public get authService(): SessionAuthService {
    return this._authService;
  }
  public set authService(value: SessionAuthService) {
    this._authService = value;
  }

  constructor(private http: HttpClient,authService:SessionAuthService) {
    console.log("ItemService: created")
    this._authService = authService;
    //this._authService = new SessionAuthService(http)
  }

  createTodoItem(todoItem:TodoItem): Observable<TodoItem> {
    console.log(`ItemService: createTodoItem called for item '${todoItem.title}'`)
    return this.http.post<any>(`${this._authService.getBaseUrl()}/item`, todoItem.toObject(), {headers: this._authService.getAuthHeaders()}).pipe(
      map(body => TodoItem.fromObject(body))
    );
  }

  // "/item"
  deleteTodoItem(listTitle:string,itemTitle:string): Observable<TodoItem> {
    console.log(`ItemService: deleteTodoItem called for item '${itemTitle}' in list '${listTitle}'`)
    const params = {
      "itemTitle" : itemTitle,
      "listTitle" : listTitle
    }
    return this.http.delete<any>(`${this._authService.getBaseUrl()}/item`, {headers: this._authService.getAuthHeaders(),params : params}).pipe(
      map(body => TodoItem.fromObject(body))
    );
  }
  
  createTodoItemList(todoItemList:TodoItemList): Observable<TodoItemList> {
    console.log(`ItemService: createTodoItemList called for list '${todoItemList.title}'`)
    return this.http.post<any>(`${this._authService.getBaseUrl()}/list`, todoItemList.toObject(), {headers: this._authService.getAuthHeaders()}).pipe(
      map(body => TodoItemList.fromObject(body))
    );
  }

  // "/list"
  readTodoItemList(title:string): Observable<TodoItemList> {
    console.log(`ItemService: readTodoItemList called for list '${title}'`)
    const params = {"title" : title}
    return this.http.get<any>(`${this._authService.getBaseUrl()}/list`, {headers: this._authService.getAuthHeaders(),params : params}).pipe(
      map(body => TodoItemList.fromObject(body))
    );
  }

  readAllTodoItemLists(): Observable<TodoItemList[]> {
    console.log(`ItemService: readTodoItemList called`)
    return this.http.get<any[]>(`${this._authService.getBaseUrl()}/list/all`, {headers: this._authService.getAuthHeaders()}).pipe(
      map(body => body.map(obj => { return TodoItemList.fromObject(obj)}))
    );
  }

  deleteTodoItemList(listTitle:string): Observable<TodoItemList> {
    console.log(`ItemService: deleteTodoItemList called for list '${listTitle}'`)
    const params = {
      "listTitle" : listTitle
    }
    return this.http.delete<any>(`${this._authService.getBaseUrl()}/list`, {headers: this._authService.getAuthHeaders(),params : params}).pipe(
      map(body => TodoItemList.fromObject(body))
    );
  }

  //TODO: "update" methods for items, lists, for now we just have CRD not CRUD :)
  
}
