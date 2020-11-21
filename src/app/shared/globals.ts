import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Globals {
  patient: any;
  fhirClient: FHIR.SMART.Client;
  byCodes: (...codes: string[]) => FHIR.SMART.Resource[];
}