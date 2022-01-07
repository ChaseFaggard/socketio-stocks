import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './notfound/notfound.component';

/* Login Guard */
import { LoginGuard } from './loginactivate.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate:[LoginGuard] },
  { path: 'dashboard/:page', component: DashboardComponent, canActivate:[LoginGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'page-not-found' },
  { path: 'page-not-found', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
