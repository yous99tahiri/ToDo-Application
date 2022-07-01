import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { TodoItem } from '../entities/todo-item';
import { TodoItemList } from '../entities/todo-item-list';
import { SessionAuthService } from './session-auth.service';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class ItemService {

  constructor(private authService:SessionAuthService) {
    console.log("ItemService: created")
    console.log("ItemService: authService null | undefined?", this.authService == null || this.authService == undefined)
  }

  createTodoItem(todoItem:TodoItem): Observable<TodoItem> {
    console.log(`ItemService: createTodoItem called for item`, todoItem)
    return this.authService.getHTTPClient().post<any>(`${this.authService.getBaseUrl()}/item`, todoItem.toObject(), {headers: new HttpHeaders()}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        console.log(`ItemService: createTodoItem response`, body)
        return TodoItem.fromObject(body)
      })
    );
  }

  updateTodoItem(todoItem:TodoItem): Observable<TodoItem> {
    console.log(`ItemService: updateTodoItem called for item`, todoItem)
    return this.authService.getHTTPClient().put<any>(`${this.authService.getBaseUrl()}/item`, todoItem.toObject(), {headers: new HttpHeaders()}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        console.log(`ItemService: updateTodoItem response`, body)
        return TodoItem.fromObject(body)
      })
    );
  }

  // "/item"
  deleteTodoItem(listId:string,itemId:string): Observable<TodoItem> {
    const params = {
      "listId" : listId,
      "itemId" : itemId
    }
    console.log(`ItemService: deleteTodoItem called with params:`,params)
    return this.authService.getHTTPClient().delete<any>(`${this.authService.getBaseUrl()}/item`, {headers: new HttpHeaders(),params : params}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        console.log(`ItemService: deleteTodoItem response`, body)
        return TodoItem.fromObject(body)
      })
    );
  }
  
  createTodoItemList(todoItemList:TodoItemList): Observable<TodoItemList> {
    console.log(`ItemService: createTodoItemList called for list`,todoItemList)
    return this.authService.getHTTPClient().post<any>(`${this.authService.getBaseUrl()}/item/list`, todoItemList.toObject(), {headers: new HttpHeaders()}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        console.log(`ItemService: createTodoItemList response`, body)
        return TodoItemList.fromObject(body)
      })
    );
  }

  // "/list"
  readTodoItemList(listId:string): Observable<TodoItemList> {
    console.log(`ItemService: readTodoItemList called for list '${listId}'`)
    const params = {"listId" : listId}
    return this.authService.getHTTPClient().get<any>(`${this.authService.getBaseUrl()}/item/list`, {headers: new HttpHeaders(),params : params}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        console.log(`ItemService: readTodoItemList response`, body)
        return TodoItemList.fromObject(body)})
    );
  }

  deleteTodoItemList(listId:string): Observable<TodoItemList> {
    console.log(`ItemService: deleteTodoItemList called for list '${listId}'`)
    const params = {
      "listId" : listId
    }
    return this.authService.getHTTPClient().delete<any>(`${this.authService.getBaseUrl()}/item/list`, {headers: new HttpHeaders(),params : params}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        console.log(`ItemService: deleteTodoItemList response`, body)
        return TodoItemList.fromObject(body)})
    );
  }

  readAllTodoItemLists(): Observable<TodoItemList[]> {
    console.log(`ItemService: readAllTodoItemList called`)
    return this.authService.getHTTPClient().get<any[]>(`${this.authService.getBaseUrl()}/item/list/all`, {headers: new HttpHeaders()}).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(body => {
        console.log(`ItemService: readAllTodoItemLists response`, body)
        return body.map(obj => { return TodoItemList.fromObject(obj)})
      })
    );
  }

  //TODO: "update" methods for items, lists, for now we just have CRD not CRUD :)
  
}
