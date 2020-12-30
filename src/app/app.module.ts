// ng g c shared/header --module app
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthenticationService} from './service/authentication.service';
import {UserService} from './service/user.service';
import {AuthInterceptor} from './interceptor/auth.interceptor';
import {AuthenticationGuard} from './guard/authentication.guard';
import {NotificationModule} from './notification.module';
import {NotificationService} from './service/notification.service';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {UserComponent} from './user/user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ItemComponent } from './item/item.component';
import { HeaderComponent } from './shared/header/header.component';
import { ListWishViewerComponent } from './list-wish-viewer/list-wish-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    ItemComponent,
    HeaderComponent,
    ListWishViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  ],
  providers: [NotificationService, AuthenticationGuard, AuthenticationService, UserService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
