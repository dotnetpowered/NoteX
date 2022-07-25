import { Injectable } from '@angular/core';
import { Resource } from 'fhirclient/lib/types';
import Client from 'fhirclient/lib/Client';
@Injectable({
  providedIn: 'root',
})
export class Globals {

  patient: any;
  fhirClient: Client;
  byCodes: (...codes: string[]) => Resource[];

}