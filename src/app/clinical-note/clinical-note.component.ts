import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { Globals } from '../shared/globals';

@Component({
  selector: 'app-clinical-note',
  templateUrl: './clinical-note.component.html',
  styleUrls: ['./clinical-note.component.css']
})
export class ClinicalNoteComponent implements OnInit {

  text: string; 
  speechAuthToken: string;
  recognizer: any;
 
  language: any;
  patient: any;

  constructor(private router: Router, private gloabls: Globals)  {
    this.language = 'en';
  }

  ngOnInit(): void {
 
    this.patient = this.gloabls.patient;
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
      window.console.log(translation);
      this.text = translation;

      this.recognizer.close();
      this.recognizer = undefined;

    });
  }

 
}