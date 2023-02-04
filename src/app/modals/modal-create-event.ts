import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Group } from '../models/group';
import { User } from '../models/user';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgModel } from '@angular/forms';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'modal-create-event',
  standalone: true,
  imports: [CommonModule, NgbTimepickerModule, FormsModule],
  template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <p>День занятия: {{ dateOfLesson }}</p>
            <p>Начало занятия:
              <ngb-timepicker id="tp1" [(ngModel)]="startTime" [meridian]="false" [spinners]="true" (ngModelChange)="validateDates()"></ngb-timepicker>
            </p>
            <p>Конец занятия: 
              <ngb-timepicker id="tp2" [(ngModel)]="endTime" [meridian]="false" [spinners]="true" (ngModelChange)="validateDates()"></ngb-timepicker>
            </p>
            <p>Цвет метки: <input type="color" id="colorEvent" required></p>
            <p>Назовите событие: <input type="text" id="textEvent" minlength="1" maxlength="100" required></p>
            <p>Описание события: </p>
            <textarea id="textDescription" minlength="1" maxlength="2000" style="width: 100%; margin-bottom: 20px"></textarea>
            <p>Назначить группу: 
                <select id="group">
                    <option *ngFor="let g of groups" value='{{ g.id }}'>{{ g.name + " - " + (g.category ? g.category.name : "Без направления") }}</option>
                </select>
            </p>
		</div>
		<div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" (click)="createEvent()">Создать</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalCreateEvent {
  @Input() modalTitle!: string;
  @Input() date!: Date;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  dateOfLesson: any;
  teachers: Array<User> = [];
  groups: Array<Group> = [];
  startTime = { hour: 8, minute: 0};
  endTime = { hour: 8, minute: 0};

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) { }

  ngOnInit() {
    this.dateOfLesson = this.date.toLocaleString("ru-RU", { weekday: "long", month: "long", day: "numeric" });
    this.startTime = { hour: this.date.getHours(), minute: this.date.getMinutes() };
    this.endTime = { hour: this.date.getHours(), minute: this.date.getMinutes() };
    
    this.validateDates();

    this.readTeachers();
    this.readGroups();
  }

  createEvent() {
    let tempDate = this.date;
    tempDate.setHours(this.startTime.hour, this.startTime.minute);
    let startDate = new Date(tempDate);
    tempDate = this.date;
    tempDate.setHours(this.endTime.hour, this.endTime.minute);
    let endDate = new Date(tempDate);

    if (!(document.getElementById("textEvent") as HTMLInputElement).value) {
      (document.getElementById("textEvent") as HTMLInputElement).setCustomValidity("Заголовок мероприятия - обязательный параметр");
      (document.getElementById("textEvent") as HTMLInputElement).reportValidity();
      return;
    }

    if (startDate >= endDate) {
      alert("Время начала позже или равно времени окончания");
      return;
    }

    let newEvent = {
      start: startDate,
      end: endDate,
      title: (document.getElementById("textEvent") as HTMLInputElement).value,
      color: {
        primary: (document.getElementById("colorEvent") as HTMLInputElement).value,
      },
      description: (document.getElementById("textDescription") as HTMLInputElement).value,
      group: { id: (document.getElementById("group") as HTMLSelectElement).value }
    }
    this.passEntry.emit(newEvent);
  }

  readTeachers() {
    this.http.get<any>(API_URL + '/users/byRole/2', AuthService.getJwtHeaderJSON())
      .subscribe(
        (result: any) => {
          this.teachers = result;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  readGroups() {
    this.http.get<any>(API_URL + '/groups/', AuthService.getJwtHeaderJSON())
      .subscribe(
        (result: any) => {
          this.groups = result;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  validateDates() {
    let tempDate = this.date;
    tempDate.setHours(this.startTime.hour, this.startTime.minute);
    let startDate = new Date(tempDate);
    tempDate = this.date;
    tempDate.setHours(this.endTime.hour, this.endTime.minute);
    let endDate = new Date(tempDate);

    if (startDate >= endDate) {
      this.startTime = { hour: this.startTime.hour, minute: this.startTime.minute };
      this.endTime = { hour: this.startTime.hour, minute: this.startTime.minute+1 };
    }

    let minStart = new Date(this.date);
    minStart.setHours(8, 0);
    if (startDate < minStart) {
      this.startTime = { hour: 8, minute: 0 };
    }

    let maxStart = new Date(this.date);
    maxStart.setHours(22, 59);
    if (startDate > maxStart) {
      this.startTime = { hour: 22, minute: 59 };
    }

    let minEnd = new Date(this.date);
    minEnd.setHours(8, 1);
    if (endDate < minEnd) {
      this.endTime = { hour: 8, minute: 1 };
    }

    let maxEnd = new Date(this.date);
    maxEnd.setHours(23, 0);
    if (endDate > maxEnd) {
      this.endTime = { hour: 23, minute: 0 };
    }
  }
}