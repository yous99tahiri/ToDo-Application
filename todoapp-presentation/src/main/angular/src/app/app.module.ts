import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TodoItemListComponent } from './components/todo-item-list/todo-item-list.component';
import { TodoItemDetailsComponent } from './components/todo-item-details/todo-item-details.component';
import { CreateTodoItemComponent } from './components/create-todo-item/create-todo-item.component';
import { CreateTodoItemListComponent } from './components/create-todo-item-list/create-todo-item-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Mat
import { MatDialogModule } from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SessionAuthService } from './services/session-auth.service';
import { ItemService } from './services/item.service';
import { UserService } from './services/user.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DashboardComponent,
    TodoItemListComponent,
    TodoItemDetailsComponent,
    CreateTodoItemComponent,
    CreateTodoItemListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  providers: [SessionAuthService,ItemService,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
