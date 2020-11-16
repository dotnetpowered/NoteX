import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Globals } from './globals';

@Injectable()
export class MappingService {
    keywordMapping: any[];
    observations: any[];

    constructor(private http: HttpClient) { 

        this.getKeywordMapping().subscribe(km=>{
            this.keywordMapping = km;
        });

        this.getObservations().subscribe(o=>{
            this.observations = o;
        });
    }

    getQuantityValueAndUnit(ob) {
        if (typeof ob != 'undefined' &&
          typeof ob.valueQuantity != 'undefined' &&
          typeof ob.valueQuantity.value != 'undefined' &&
          typeof ob.valueQuantity.unit != 'undefined') {
          return Number(parseFloat((ob.valueQuantity.value)).toFixed(2)) + ' ' + ob.valueQuantity.unit;
        } else {
          return undefined;
        }
    }

    mapping(keywords: string[], observationValues: any[]) {
        let keywordLoopkups = [];
        keywords.forEach(element => {
            let s = element.toLowerCase().replace('.', '');
            let mapping = this.keywordMapping.find(m=>m.keyword===s);

            if (mapping != null) {
                console.log(mapping);

                let keywordLookup = { keyword: mapping.keyword, observation:[] };
                keywordLoopkups.push(keywordLookup);

                mapping.observation.forEach(o => {
                    let ob = this.observations.find(observation=>observation.name === o);
                    ob.coding.forEach(c => {
                        console.log('lookup ' + c.code)
                        let code = <string>c.code;
                        
                        let obData = observationValues.find(o=>o.resource.code.coding[0].code===code);
                        if (obData != null ) {
                            console.log('found', obData);
                            keywordLookup.observation.push(
                                ob.name + ': ' +
                                this.getQuantityValueAndUnit(obData.resource));
                        }
                    });
                    
                })

            }
        });

        console.log(keywordLoopkups);

        return keywordLoopkups;
    }

    getKeywordMapping(): Observable<any[]>
    {
        const url = `/assets/keyword-mapping.json`;
        return this.http.get<any[]>(url);
    }

    getObservations(): Observable<any[]>
    {
        const url = `/assets/observations.json`;
        return this.http.get<any[]>(url);
    }
}