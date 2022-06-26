import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { TodoItem } from '../entities/todo-item';
import { TodoItemList } from '../entities/todo-item-list';
import { SessionAuthService } from './session-auth.service';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class ItemService {

  private _authService: SessionAuthService;
  
  public get authService(): SessionAuthService {
    return this._authService;
  }
  public set authService(value: SessionAuthService) {
    this._authService = value;
  }

  constructor(authService:SessionAuthService) {
    console.log("ItemService: created")
    this._authService = authService;
  }

  createTodoItem(todoItem:TodoItem): Observable<TodoItem> {
    console.log(`ItemService: createTodoItem called for item '${todoItem.title}'`)
    return this._authService.getHTTPClient().post<any>(`${this._authService.getBaseUrl()}/item`, todoItem.toObject(), {headers: new HttpHeaders()}).pipe(
      map(body => TodoItem.fromObject(body))
    );
  }

  updateTodoItem(todoItem:TodoItem): Observable<TodoItem> {
    console.log(`ItemService: updateTodoItem called for item '${todoItem.title}'`)
    return this._authService.getHTTPClient().put<any>(`${this._authService.getBaseUrl()}/item`, todoItem.toObject(), {headers: new HttpHeaders()}).pipe(
      map(body => TodoItem.fromObject(body))
    );
  }

  // "/item"
  deleteTodoItem(listTitle:string,itemTitle:string): Observable<TodoItem> {
    console.log(`ItemService: deleteTodoItem called for item '${itemTitle}' in list '${listTitle}'`)
    const params = {
      "listTitle" : listTitle,
      "itemTitle" : itemTitle
    }
    return this._authService.getHTTPClient().delete<any>(`${this._authService.getBaseUrl()}/item`, {headers: new HttpHeaders(),params : params}).pipe(
      map(body => TodoItem.fromObject(body))
    );
  }
  
  createTodoItemList(todoItemList:TodoItemList): Observable<TodoItemList> {
    console.log(`ItemService: createTodoItemList called for list '${todoItemList.title}'`)
    return this._authService.getHTTPClient().post<any>(`${this._authService.getBaseUrl()}/item/list`, todoItemList.toObject(), {headers: new HttpHeaders()}).pipe(
      map(body => TodoItemList.fromObject(body))
    );
  }

  // "/list"
  readTodoItemList(listTitle:string): Observable<TodoItemList> {
    console.log(`ItemService: readTodoItemList called for list '${listTitle}'`)
    const params = {"listTitle" : listTitle}
    return this._authService.getHTTPClient().get<any>(`${this._authService.getBaseUrl()}/item/list`, {headers: new HttpHeaders(),params : params}).pipe(
      map(body => TodoItemList.fromObject(body))
    );
  }

  deleteTodoItemList(listTitle:string): Observable<TodoItemList> {
    console.log(`ItemService: deleteTodoItemList called for list '${listTitle}'`)
    const params = {
      "listTitle" : listTitle
    }
    return this._authService.getHTTPClient().delete<any>(`${this._authService.getBaseUrl()}/item/list`, {headers: new HttpHeaders(),params : params}).pipe(
      map(body => TodoItemList.fromObject(body))
    );
  }

  readAllTodoItemLists(): Observable<TodoItemList[]> {
    console.log(`ItemService: readAllTodoItemList called`)
    return this._authService.getHTTPClient().get<any[]>(`${this._authService.getBaseUrl()}/item/list/all`, {headers: new HttpHeaders()}).pipe(
      map(body => {
        console.log("--------------")
        console.log("Received body on readAllTodoItemLists:", body)
        console.log("Body as json:", JSON.stringify(body))
        console.log("typeof:", typeof(body))
        console.log("--------------")
        return body.map(obj => { return TodoItemList.fromObject(obj)})
      })
    );
  }

  //TODO: "update" methods for items, lists, for now we just have CRD not CRUD :)
  
}
