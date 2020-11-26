import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Globals } from './globals';
import { environment } from '../../environments/environment';

@Injectable()
export class MappingService {
    keywordMapping: any[];
    observationMapping: any[];
    client: FHIR.SMART.Client;

    constructor(private http: HttpClient,
        private globals: Globals) {

        this.client = globals.fhirClient;

        this.getKeywordMapping().subscribe(km => {
            this.keywordMapping = km;
        });

        this.getObservations().subscribe(o => {
            this.observationMapping = o;
        });
    }

    processText(text: string, callback: (keywordLookups: any[]) => void) {
        const keywordLookups = [];
        const htmlLessText = text.replace( /(<([^>]+)>)/ig, '');
        const punctuationless = htmlLessText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        const finalString = punctuationless.replace(/\s{2,}/g," ");
        const keywords = finalString.split(' ');

        this.processKeywords(keywords, keywordLookups, callback);
    }

    private processKeywords(keywords: string[], keywordLookups: any[], callback: (keywordLookups: any[]) => void) {

        let mapping = null;
        let keyword = null;
        while (keywords.length !== 0 && mapping == null)
        {
            keyword = keywords.pop();
            mapping = this.keywordMapping.find(m => m.keyword.toLowerCase() === keyword.toLowerCase());
        }
        if (mapping != null) {
            console.log(`Processing mapping for keyword "${keyword}"`, mapping);

            const keywordLookup = { keyword, observation: [] };
            keywordLookups.push(keywordLookup);

            const observations = [...mapping.observation];
            this.processObservations(observations, keywordLookup, () =>
                this.processKeywords(keywords, keywordLookups, callback)
            );
        } else {
            callback(keywordLookups);
        }
    }

    private processObservations(observations: any[], keywordLookup, callback){

        const o = observations.pop();

        const ob = this.observationMapping.find(observation => observation.name === o);
        const codes = [];
        ob.coding.forEach(c => {
            const code = c.code as string;
            codes.push(code);
        });
        const observationLookup = { name: ob.name, observation: [] };
        keywordLookup.observation.push(observationLookup);
        this.lookupFhirObservations(codes, observationLookup, (observation) => {
            if (observations.length === 0) {
                callback();
            } else {
                this.processObservations(observations, keywordLookup, callback);
            }
        });
    }

    private lookupFhirObservations(codes: string[], keywordLookup: any, callback: (keywordLookup: any) => void) {

        const code = codes.pop();

        const query =  {
            type: 'Observation',
            query: { patient: this.client.patient.id, code}
        } as FHIR.SMART.SearchParams;

        console.log('Executing FHIR query for observation: ' + code, query);
        this.client.api.search(query).then(
            response => {
                this.processFhirObservation(response, code, keywordLookup);
                if (codes.length !== 0) {
                    this.lookupFhirObservations(codes, keywordLookup, callback);
                } else {
                    // sort descending
                    keywordLookup.observation.sort((n1,n2) => {
                        if (n1.effectiveDateTime > n2.effectiveDateTime) {
                            return -1;
                        }

                        if (n1.effectiveDateTime < n2.effectiveDateTime) {
                            return 1;
                        }

                        return 0;
                    });
                    callback(keywordLookup);
                }
            }
          ).catch(reason => console.log(reason));
    }

    private processFhirObservation(response, code, keywordLookup) {
        const observations = response.data.entry as FHIR.SMART.Resource[];

        if (observations != null) {
            console.log('observation: ' + code, observations);

            observations.forEach(entry => {
                const ob = entry.resource;
                if (ob.valueQuantity) {
                    keywordLookup.observation.push({
                        code,
                        measurement: Number(parseFloat((ob.valueQuantity.value)).toFixed(2)) + ' ' + ob.valueQuantity.unit,
                        effectiveDateTime: new Date(ob.effectiveDateTime)
                    });
                } else {
                    const components = [];
                    ob.component.forEach(component => {
                        components.push({
                            display: component.code.text,
                            measurement: Number(parseFloat((component.valueQuantity.value)).toFixed(2))
                                + ' ' + component.valueQuantity.unit
                        });
                    });
                    keywordLookup.observation.push({
                        code,
                        effectiveDateTime: new Date(ob.effectiveDateTime),
                        components
                    });
                }
            });
        }
    }

    private getKeywordMapping(): Observable<any[]>
    {
        const url = `${environment.mappingAssetsBaseRef}/keyword-mapping.json`;
        return this.http.get<any[]>(url);
    }

    private getObservations(): Observable<any[]>
    {
        const url = `${environment.mappingAssetsBaseRef}/observations.json`;
        return this.http.get<any[]>(url);
    }
}
