import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '',
    loadChildren:() => import('./ingreso-egreso/ingreso-egreso.module').then(m => m.IngresoEgresoModule),
    canLoad: [AuthGuard]
  },
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
