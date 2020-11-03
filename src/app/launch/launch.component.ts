import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchComponent implements OnInit {

  constructor(private _route: ActivatedRoute,) { 

  }

  ngOnInit(): void {
    const uniqueName = this._route.snapshot.paramMap.get('uniqueName');

    FHIR.oauth2.authorize({ 
      client: {
        client_id: 'eda8b8e5-ba47-438e-b70d-21076b332819',
        scope: 'patient/Patient.read patient/Observation.read patient/MedicationRequest.read patient/Observation.write launch online_access openid profile'
      }
    });
  }

}
