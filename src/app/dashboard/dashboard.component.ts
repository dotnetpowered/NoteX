import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Globals } from '../shared/globals';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:  []
})
export class DashboardComponent implements OnInit {

  fhirClient: FHIR.SMART.Client;
  patient: any;
  user: any;
  notes: any[];

  constructor(private router: Router, private gloabls: Globals) { }

  addNote(): void {
     this.router.navigate(['clinical-note']);
  }

  ngOnInit(): void {
    console.log('checking oauth2 ready');
    FHIR.oauth2.ready((client)=>{
      console.log('state',client.state);
      console.log('id',client.patient.id);
      console.log('client', client);
      this.fhirClient = client;
      client.patient.api.fetchAll({ type:"DocumentReference" }).then(
        (response)=>{
          this.notes = response;
          console.log(this.notes);
        }

      );
      client.patient.read().then(
        (response)=>{
          console.log('patient', response);
          this.patient = response;
          this.gloabls.patient = response;
        }
      );
      client.user.read().then((response)=>
      {
         console.log('user', response);
         this.user = response;
      })
    });
  }

}
