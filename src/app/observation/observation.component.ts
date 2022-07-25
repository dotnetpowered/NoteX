import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { fhirclient } from 'fhirclient/lib/types';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {

  data: any;

  constructor(private route: ActivatedRoute,
              private smart: fhirclient.SMART,
              private titleService: Title) { }

  ngOnInit(): void {
    console.log('checking oauth2 ready');
    this.smart.ready((client) => {
      console.log('state', client.state);
      console.log('id', client.patient.id);
      console.log('client', client);

      this.route.queryParams
        .subscribe(params => {
          const lookups = JSON.parse(localStorage.getItem('lookups'));
          const keyword = params['keyword'];
          const lookupValues = lookups.find(v=>v.keyword === keyword);
          this.data = lookupValues;
          this.titleService.setTitle('Observations for: ' + keyword);
          console.log(lookupValues);
        }
      );
      });
  }

}
