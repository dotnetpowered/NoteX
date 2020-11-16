import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Globals {
  patient: any;
  observations: any[];
  byCodes: (...codes: string[]) => FHIR.SMART.Resource[];
}