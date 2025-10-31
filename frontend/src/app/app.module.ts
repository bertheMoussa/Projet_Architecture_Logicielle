import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersListComponent } from './users-list/users-list.component';
import { MatTableModule } from '@angular/material/table';
import { LoginComponent } from './login/login.component';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { TokenHttpInterceptor } from './interceptors/token.interceptor';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AssociationsListComponent } from './associations-list/associations-list.component';
import { AssociationsMembersComponent } from './associations-members/associations-members.component';
import { AssociationsMinutesComponent } from './associations-minutes/associations-minutes.component';
import { HomeComponent } from './home/home.component';
import { UsersProfilComponent } from './users-profil/users-profil.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    LoginComponent,
    NavComponent,
    AssociationsListComponent,
    AssociationsMembersComponent,
    AssociationsMinutesComponent,
    HomeComponent,
    UsersProfilComponent,
    SearchBarComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatTableModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,

  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenHttpInterceptor,
        multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
