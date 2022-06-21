import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionAuthService } from './services/session-auth.service';

@Component({
  selector: 'wt2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {

  authService: SessionAuthService;

  constructor(private http: HttpClient,authService:SessionAuthService, private router:Router) {
    console.log("AppComponent created")
    this.authService = authService;
  }

  load(): void {
  }

  logout() {
    this.authService.logout().subscribe();
    this.router.navigate(["/login"])
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
}
