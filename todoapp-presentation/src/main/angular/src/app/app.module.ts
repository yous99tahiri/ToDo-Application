import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//services
import { ItemService } from './services/item.service';
import { UserService } from './services/user.service';
import { SessionAuthService } from './services/session-auth.service';

//components
import { AuthentificationComponent } from './components2/authentification/authentification.component';
import { RegistrationComponent } from './components2/registration/registration.component';
import { ProfileComponent } from './components2/profile/profile.component';
import { MessageBoxComponent } from './components2/message-box/message-box.component';
import { ConfirmationDialogContentComponent } from './components2/dialog/contents/confirmation-dialog-content/confirmation-dialog-content.component';
import { ItemDetailsDialogContentComponent } from './components2/dialog/contents/item-details-dialog-content/item-details-dialog-content.component';
import { ListCreationDialogContentComponent } from './components2/dialog/contents/list-creation-dialog-content/list-creation-dialog-content.component';
import { ItemCreationDialogContentComponent } from './components2/dialog/contents/item-creation-dialog-content/item-creation-dialog-content.component';
import { DashboardComponent } from './components2/dashboard/dashboard.component';
//Mat
import { MatDialogModule } from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutModule } from '@angular/cdk/layout';
import {MatListModule} from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
@NgModule({
  declarations: [
    AppComponent,
    AuthentificationComponent,
    RegistrationComponent,
    ProfileComponent,
    MessageBoxComponent,
    ConfirmationDialogContentComponent,
    ItemDetailsDialogContentComponent,
    ListCreationDialogContentComponent,
    ItemCreationDialogContentComponent,
    DashboardComponent
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
    ReactiveFormsModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    LayoutModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule
  ],
  providers: [SessionAuthService,UserService,ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
