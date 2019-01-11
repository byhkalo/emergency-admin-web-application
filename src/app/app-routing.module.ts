import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AmbulanceEmergensiesComponent } from './ambulance-emergensies/ambulance-emergensies.component';
import { EmergenciesComponent } from './emergencies/emergencies.component';

const routes: Routes = [

  { path: "map", component: MapComponent },
  { path: "emergencies", component: EmergenciesComponent },
  // { path: "emergencies", component: EmergenciesComponent, canActivate: [AuthGuard] },
  { path: "ambulance-emerg", component: AmbulanceEmergensiesComponent },
  { path: "**", redirectTo: "map", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
