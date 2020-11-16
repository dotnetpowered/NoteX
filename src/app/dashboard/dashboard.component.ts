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

  constructor(private router: Router, private globals: Globals) { }

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
      let query = <FHIR.SMART.SearchParams>{
        type: 'Observation',
        query: { 'patient': client.patient.id}
      };
      client.api.search(query).then(
        response=>{
          let ob = <FHIR.SMART.Resource[]>response.data.entry;
          this.globals.observations = ob;
          //this.globals.byCodes = client.byCodes(ob);
          console.log(response);
          this.nextPage(client, this.globals.observations, response.data);
          //console.log(this.globals.observations);
        }
      );
      client.patient.read().then(
        (response)=>{
          console.log('patient', response);
          this.patient = response;
          this.globals.patient = response;
        }
      );
      client.user.read().then((response)=>
      {
         console.log('user', response);
         this.user = response;
      })
    });
  }

  nextPage(client: FHIR.SMART.Client, rows: any[], bundle: FHIR.SMART.Bundle) {
    console.log('paging');
    client.api.nextPage(bundle).then( (response)=> {
      console.log('page response', response);
      if (response.data !=null) {
        rows.push(response.data);
        this.nextPage(client, rows, response.data);
      }
    }).catch(reason=>console.log(reason));
  }
}