import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionAuthService } from './services/session-auth.service';
import { UserService } from './services/user.service';
import { ItemService } from './services/item.service';

@Component({
  selector: 'wt2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {

  authService: SessionAuthService;

  constructor(private http: HttpClient,authService:SessionAuthService) {
    console.log("AppComponent created")
    this.authService = authService;
    //this.itemService = new ItemService(this.http)
    //this.itemService.authService = this.authService;
    //this.userService = new UserService(this.http)
    //this.userService.authService = this.authService;
  }

  ngOnInit() {
  }

  load(): void {
  }

  logout() {
    this.authService.logout().subscribe();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
}
