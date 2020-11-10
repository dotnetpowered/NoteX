import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LaunchComponent } from './launch/launch.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext'
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {InputNumberModule} from 'primeng/inputnumber';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {EditorModule} from 'primeng/editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ClinicalNoteComponent } from './clinical-note/clinical-note.component';
import { Globals } from './shared/globals';

@NgModule({
  declarations: [
    AppComponent,
    LaunchComponent,
    DashboardComponent,
    ClinicalNoteComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    EditorModule,
    DropdownModule,
    BrowserAnimationsModule,
    CalendarModule,
    DialogModule,
    FormsModule,
    CheckboxModule,
    HttpClientModule
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
