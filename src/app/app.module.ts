import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarBlockComponent } from './components/calendar-block/calendar-block.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupBlockComponent } from './components/group-block/group-block.component';
import { UserBlockComponent } from './components/user-block/user-block.component';
import { CommonModule } from '@angular/common';
import { TutorialComponent } from './components/tutorial/tutorial.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    CalendarBlockComponent,
    GroupBlockComponent,
    UserBlockComponent,
    TutorialComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    NgbTimepickerModule,
    CommonModule,
    HttpClientModule,
    ContextMenuModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
