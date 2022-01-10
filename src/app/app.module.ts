import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './dashboard/home/home.component';
import { AccountComponent } from './dashboard/account/account.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/* PrimeNG Modules */
import { InputSwitchModule } from 'primeng/inputswitch';
import {MenuModule} from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { LoginGuard } from './loginactivate.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NotFoundComponent,
    HomeComponent,
    AccountComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    InputSwitchModule,
    ReactiveFormsModule,
    SocialLoginModule,
    MenuModule,
    ButtonModule,
    RippleModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1087485042004-qng81mtuk9hjl1d5hffvklm6t7olbvt5.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
    LoginGuard  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
