import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicalNoteComponent } from './clinical-note/clinical-note.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LaunchComponent } from './launch/launch.component';
import { ObservationComponent } from './observation/observation.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'launch', component: LaunchComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clinical-note/:id', component: ClinicalNoteComponent },
  { path: 'observation', component: ObservationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
