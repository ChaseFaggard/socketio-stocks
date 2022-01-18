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
import { HttpClientModule } from '@angular/common/http';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteModule } from 'primeng/autocomplete';

/* PrimeNG Modules */
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';

import { ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { LoginGuard } from './loginactivate.guard';
import { TrackFocusDirective } from './trackfocus.directive';
import { LiveChartComponent } from './dashboard/home/livechart/livechart.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NotFoundComponent,
    HomeComponent,
    AccountComponent,
    SettingsComponent,
    TrackFocusDirective,
    LiveChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    InputSwitchModule,
    ReactiveFormsModule,
    SocialLoginModule,
    HttpClientModule,
    PlotlyModule,
    BrowserAnimationsModule,
    DropdownModule,
    AutoCompleteModule
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
