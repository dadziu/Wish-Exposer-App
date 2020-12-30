import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {UserComponent} from './user/user.component';
import {AuthenticationGuard} from './guard/authentication.guard';
import {ItemComponent} from './item/item.component';
import {ListWishViewerComponent} from './list-wish-viewer/list-wish-viewer.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  // until AuthenticationGuard is true user is able to go to this path:
  {path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard]},
  {path: 'wishes/:pathId', component: ListWishViewerComponent},
  {path: 'wishlist', component: ItemComponent, canActivate: [AuthenticationGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
