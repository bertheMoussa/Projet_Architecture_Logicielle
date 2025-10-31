import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { authGuard } from './guards/auth.guard';
import { Association } from './associations-list/Association';
import { AssociationsListComponent } from './associations-list/associations-list.component';
import { AssociationsMembersComponent } from './associations-members/associations-members.component';
import { AssociationsMinutesComponent } from './associations-minutes/associations-minutes.component';
import { HomeComponent } from './home/home.component';
import { UsersProfilComponent } from './users-profil/users-profil.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'users', component: UsersListComponent},
  {path: 'associations', component: AssociationsListComponent},
  {path: 'home', component: HomeComponent},
  {path: 'associations/:id/members', component: AssociationsMembersComponent},
  {path: 'associations/:id/minutes', component: AssociationsMinutesComponent},
  {path: 'login', component: LoginComponent },
  {path: 'search', component: SearchBarComponent },
  {path: 'profil', component: UsersProfilComponent},

  ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
