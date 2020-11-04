import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clinical-note',
  templateUrl: './clinical-note.component.html',
  styleUrls: ['./clinical-note.component.css']
})
export class ClinicalNoteComponent implements OnInit {

  text: string; 

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['']);
  }

}
