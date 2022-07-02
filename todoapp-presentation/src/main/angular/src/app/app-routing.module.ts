import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components2/dashboard/dashboard.component';
import { ProfileComponent } from './components2/profile/profile.component';
import { AuthentificationComponent } from './components2/authentification/authentification.component';
import { RegistrationComponent } from './components2/registration/registration.component';
import { AuthGuard } from './services/auth.guard';
import { DeAuthGuard } from './services/de-auth.guard';

const routes: Routes = [
  { path: 'auth', component: AuthentificationComponent,canActivate:[DeAuthGuard]},//
  { path: 'register', component: RegistrationComponent,canActivate:[DeAuthGuard]},//
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard]},//
  { path: 'profile', component: ProfileComponent,canActivate:[AuthGuard]},//
  { path: '', redirectTo:"/dashboard",pathMatch:"prefix"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
