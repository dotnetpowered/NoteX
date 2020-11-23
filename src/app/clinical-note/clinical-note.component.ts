import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { Globals } from '../shared/globals';
import { MappingService } from '../shared/mapping.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-clinical-note',
  templateUrl: './clinical-note.component.html',
  styleUrls: ['./clinical-note.component.css'],
  providers: [MappingService]
})
export class ClinicalNoteComponent implements OnInit {

  noteText: string = '';//'Patient is overweight and has hypertension.'; 
  speechAuthToken: string;
  recognizer: any;
 
  language: any;
  patient: any;
  id: string = null;
  note: any;
  action: string;
  message: string;
  selectedType: string;
  noteTypes: SelectItem[] = [];

  constructor(private router: Router, private globals: Globals, 
    private route: ActivatedRoute,
    private mappingSvc: MappingService)  {
    this.language = 'en';
    this.setDefaultMessage();

    this.noteTypes.push({ label:'Consultation Note',value:'11488-4' });
    this.noteTypes.push({ label:'Discharge Summary',value:'18842-5' });
    this.noteTypes.push({ label:'History & Physical Note',value:'34117-2' });
    this.noteTypes.push({ label:'Procedures Note',value:'28570-0' });
    this.noteTypes.push({ label:'Progress Note',value:'11506-3' });
    this.selectedType = '11488-4';
  }

  setDefaultMessage() {
    this.message = 'Click the speak button and begin speaking...';
  }

  ngOnInit(): void {
 
    this.patient = this.globals.patient;

    this.route.params
      .subscribe(params => {
        console.log(params);
        const idParam = params['id'];

        if (idParam !== 'new') {
          this.id = idParam;
          this.action = 'Edit';
          this.globals.fhirClient.api.read(
            { id: this.id, type: 'DocumentReference'}).then(
            (result)=>{
              console.log('Loaded note', result.data);
              this.note = result.data;
              this.noteText = atob(this.note.content[0].attachment.data);
              this.selectedType = this.note.type.coding[0].code;
            }
          );
        } else {
          this.action = 'Add';
        }
      });
  }

  save(): void {
    const htmlLessText = this.noteText.replace( /(<([^>]+)>)/ig, '');
    const encodedText = btoa(htmlLessText);

    if (this.id==null) {
      this.create(encodedText);
    } else {
      this.update(encodedText);
    }
  }

  update(encodedText): void {
    const typeLabel = this.noteTypes.find(n=>n.value === this.selectedType).label;
    this.note.content[0].attachment.data = encodedText;
    this.note.type.coding[0].code = this.selectedType;
    this.note.type.coding[0].display = typeLabel;
    this.note.type.text = typeLabel;

    let e: FHIR.SMART.Entry = { 
      type: 'DocumentReference',
      resource: this.note
    };

    console.log('Update note',e);
    this.globals.fhirClient.api.update(e).then(()=>{this.router.navigate(['']);});

  }

  create(encodedText): void {
    const typeLabel = this.noteTypes.find(n=>n.value === this.selectedType).label;
    let e: FHIR.SMART.Entry = { 
      type: 'DocumentReference',
      resource: {
        resourceType: 'DocumentReference',
        type: {
            coding: [
                {
                    system: "http://loinc.org",
                    code: this.selectedType,
                    display: typeLabel
                }
            ],
            text: typeLabel
        },
        subject: {
            reference: "Patient/" + this.patient.id
        },
        content: [{attachment: {
            contentType: "text/plain",
            data: encodedText }}
        ] 
      }
    };
    console.log('Create note',e);
    this.globals.fhirClient.api.create(e).then(()=>{this.router.navigate(['']);});
  }

  cancel(): void {
    this.router.navigate(['']);
  }

  startSpeakingClick() {
    this.message = 'Listening...';

    const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
      '5509abb54dd14415bd7b3b00fe9a8a1f', 'EastUS');
    speechConfig.speechRecognitionLanguage = 'en-US';
    speechConfig.addTargetLanguage(this.language);
    const audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    this.recognizer = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    this.recognizer.recognizeOnceAsync((result)=> {
        const translation = result.translations.get(this.language);
        this.message = 'Processing...';
        this.processText(translation);
        this.recognizer.close();
        this.recognizer = undefined;
    });
  }

  processText(text) {
    console.log('Captured text: ' + text);      
    this.mappingSvc.client = this.globals.fhirClient;
    this.mappingSvc.processText(text, (keywordLookups)=>{
      console.log('Found keyword lookups: ', keywordLookups);

      keywordLookups.forEach(lookup => {
          let infoText = '';
          if (lookup.observation.length > 0) {
            lookup.observation.forEach(ob => {
                if (ob.observation.length>0) {
                  if (ob.observation[0].measurement) {
                    infoText = `${infoText}; ${ob.name}:${ob.observation[0].measurement}`;
                  } else {
                    infoText = `${infoText}; ${ob.name}:`;
                    ob.observation[0].components.forEach(component => {
                      const display = component.display.replace(ob.name,'').trim();
                      infoText = `${infoText} ${display} ${component.measurement}`;
                    });
                  }
                }
            }
            );
            if (infoText === '') {
              text  = text.replace(lookup.keyword, lookup.keyword + ' (missing observation)');
            } else {
              text  = text.replace(lookup.keyword, '<strong>' + 
                lookup.keyword + '</strong> (<a href="/observation?keyword=' + lookup.keyword +
                '">' + infoText.substring(2) +'</a>)');
            }
          }
      });
      localStorage.setItem('lookups', JSON.stringify(keywordLookups));
      this.noteText = text;
      this.setDefaultMessage();
    });
  }

 
}