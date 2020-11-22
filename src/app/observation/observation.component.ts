import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {

  data: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('checking oauth2 ready');
    FHIR.oauth2.ready((client) => {
      console.log('state', client.state);
      console.log('id', client.patient.id);
      console.log('client', client);

      this.route.queryParams
        .subscribe(params => {
          const lookups = JSON.parse(localStorage.getItem('lookups'));
          const keyword = params['keyword'];
          const lookupValues = lookups.find(v=>v.keyword === keyword);
          this.data = lookupValues;
          console.log(lookupValues);
        }
      );
      });
  }

}
