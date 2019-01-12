import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AmbulanceEmergensiesComponent } from './ambulance-emergensies/ambulance-emergensies.component';
import { EmergenciesComponent } from './emergencies/emergencies.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/services/auth.guard';

const routes: Routes = [
  {path: "login", component: LoginComponent },
  { path: "map", component: MapComponent, canActivate: [AuthGuard] },
  { path: "emergencies", component: EmergenciesComponent, canActivate: [AuthGuard] },
  { path: "ambulance-emerg", component: AmbulanceEmergensiesComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "map", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
