import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { Globals } from '../shared/globals';
import { MappingService } from '../shared/mapping.service';

@Component({
  selector: 'app-clinical-note',
  templateUrl: './clinical-note.component.html',
  styleUrls: ['./clinical-note.component.css'],
  providers: [MappingService]
})
export class ClinicalNoteComponent implements OnInit {

  text: string; 
  speechAuthToken: string;
  recognizer: any;
 
  language: any;
  patient: any;

  constructor(private router: Router, private globals: Globals,
    private mappingSvc: MappingService)  {
    this.language = 'en';
  }

  ngOnInit(): void {
 
    this.patient = this.globals.patient;
  }

  cancel(): void {
    this.router.navigate(['']);
  }

  startSpeakingClick() {
    console.log('click');
    const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
      '5509abb54dd14415bd7b3b00fe9a8a1f', 'EastUS');
    speechConfig.speechRecognitionLanguage = 'en-US';
    speechConfig.addTargetLanguage(this.language);
    const audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    this.recognizer = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    this.recognizer.recognizeOnceAsync((result)=> {

      let translation = result.translations.get(this.language);
      console.log('Captured text: ' + translation);
      this.text = translation;
      
      const keywords = this.text.split(' ');
      this.mappingSvc.client = this.globals.fhirClient;
      this.mappingSvc.processKeywords(keywords, [], (keywordLookups)=>{
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
                this.text  = this.text.replace(lookup.keyword, lookup.keyword + ' (missing observation)');
              } else {
                this.text  = this.text.replace(lookup.keyword, lookup.keyword + ' (' + infoText.substring(2) +')');
              }
            }
        });
      });

      this.recognizer.close();
      this.recognizer = undefined;

    });
  }

 
}