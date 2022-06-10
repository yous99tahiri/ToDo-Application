import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SessionAuthService } from './services/session-auth.service';

@Component({
  selector: 'wt2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: []
})
export class AppComponent implements OnInit {

  authService: AuthService;

  constructor(private http: HttpClient,
              /*private authNewsService: AuthNewsService*/) {
    this.authService = new SessionAuthService(this.http);
    //this.authNewsService.authService = this.authService;
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
