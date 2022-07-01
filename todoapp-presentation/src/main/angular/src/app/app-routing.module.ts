import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components2/dashboard/dashboard.component';
import { ProfileComponent } from './components2/profile/profile.component';
import { AuthentificationComponent } from './components2/authentification/authentification.component';
import { RegistrationComponent } from './components2/registration/registration.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'auth', component: AuthentificationComponent},
  { path: 'register', component: RegistrationComponent},
  { path: 'dashboard', component: DashboardComponent},//,canActivate:[AuthGuard]
  { path: 'profile', component: ProfileComponent}//,canActivate:[AuthGuard]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
