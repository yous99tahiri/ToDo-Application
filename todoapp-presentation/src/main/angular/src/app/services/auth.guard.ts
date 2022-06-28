import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { SessionAuthService } from './session-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:SessionAuthService, private router:Router){
    console.log("AuthGuard: created")
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("AuthGuard: canActivate called")
    return this.authService.getIsLoggedIn().pipe(map(isLoggedIn => isLoggedIn || this.router.createUrlTree(["loginc"]) )) ;
  }
  
}
