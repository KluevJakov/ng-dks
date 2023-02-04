import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Color } from '../models/color';
import { Group } from '../models/group';
import { Lesson } from '../models/lesson';
import { User } from '../models/user';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-view-event',
    standalone: true,
    imports: [CommonModule, NgbTimepickerModule, FormsModule],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body" >
            <p>День занятия: {{ dateOfLesson }}</p>
            <p>Начало занятия:
              <ngb-timepicker id="tp1" [(ngModel)]="startTime" [meridian]="false" [spinners]="allowToEdit" (ngModelChange)="validateDates()" [disabled]="!allowToEdit"></ngb-timepicker>
            </p>
            <p>Конец занятия: 
              <ngb-timepicker id="tp2" [(ngModel)]="endTime" [meridian]="false" [spinners]="allowToEdit" (ngModelChange)="validateDates()" [disabled]="!allowToEdit"></ngb-timepicker>
            </p>
            <p *ngIf="currentUser.roles[0].systemName == 'ADMIN'">
                Цвет метки: 
                <input type="color" id="colorEvent" value="{{fullEvent.color.primary}}" [disabled]="!allowToEdit">
            </p>
            <p>Назование события: <input type="text" id="textEvent" minlength="1" maxlength="100" value="{{event.title}}" [disabled]="!allowToEdit"></p>
            <p>Описание события: </p>
            <textarea id="textDescription" minlength="1" maxlength="2000" style="width: 100%; margin-bottom: 20px" [disabled]="!allowToEdit">{{fullEvent.description}}</textarea>
            <p>Привязанная группа: 
                <select id="group" [disabled]="!allowToEdit">
                    <option *ngIf="fullEvent.group && !allowToEdit" value='{{ fullEvent.group.id }}'>{{ fullEvent.group.name + " - " + (fullEvent.group.category ? fullEvent.group.category.name : "Без направления") }}</option>
                    <option *ngFor="let g of groups" value='{{ g.id }}' [selected]="g.id == fullEvent.group.id">
                        {{ g.name + " - " + (g.category ? g.category.name : "Без направления") }}
                    </option>
                </select>
            </p>
            <hr>
            <p>Домашнее задание: </p>
            <textarea id="textHomework" minlength="1" maxlength="2000" style="width: 100%; margin-bottom: 20px" [disabled]="!allowToHW && !allowToEdit">{{fullEvent.homework}}</textarea>
		</div>
		<div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" *ngIf="currentUser.roles[0].systemName == 'TEACHER'" (click)="homework()">Задать ДЗ</button>
            <button type="button" class="btn btn-outline-dark" *ngIf="currentUser.roles[0].systemName == 'ADMIN'" (click)="editEvent()">Редактировать</button>
            <button type="button" class="btn btn-outline-dark" *ngIf="currentUser.roles[0].systemName == 'ADMIN'" (click)="deleteEvent()">Удалить</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalViewEvent {
    @Input() modalTitle!: string;
    @Input() event!: CalendarEvent;
    fullEvent: Lesson = new Lesson({});
    public currentUser: User = JSON.parse(AuthService.getCurrentUser());

    dateOfLesson: any;
    startTime = { hour: 8, minute: 0 };
    endTime = { hour: 8, minute: 0 };
    allowToEdit: boolean = false;
    allowToHW: boolean = false;
    groups: Array<Group> = [];

    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient) { }

    ngOnInit() {
        this.readEvent();

        this.dateOfLesson = this.event.start.toLocaleString("ru-RU", { weekday: "long", month: "long", day: "numeric" });
        this.startTime = { hour: this.event.start.getHours(), minute: this.event.start.getMinutes() };
        this.endTime = { hour: this.event.end!.getHours(), minute: this.event.end!.getMinutes() };
    }

    readEvent() {
        this.http.get<any>(API_URL + '/lessons/' + this.event.id, AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.fullEvent = result;
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
    }

    deleteEvent() {
        if (confirm("Вы уверены?")) {
            this.http.delete<any>(API_URL + '/lessons/' + this.event.id, AuthService.getJwtHeaderJSON())
                .subscribe(
                    (result: any) => {
                        this.activeModal.close();
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error.error);
                    }
                );
        }
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

    homework() {
        if (this.allowToHW) {
            this.fullEvent.homework = (document.getElementById("textHomework") as HTMLInputElement).value;
            
            this.http.put<any>(API_URL + '/lessons/', this.fullEvent, AuthService.getJwtHeaderJSON())
                .subscribe(
                    (result: any) => {
                        this.activeModal.close();
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error.error);
                    }
                );
        } else {
            this.allowToHW = true;
        }
    }

    editEvent() {
        if (this.allowToEdit) {
            let tempDate = this.event.start;
            tempDate.setHours(this.startTime.hour, this.startTime.minute);
            let startDate = new Date(tempDate);
            tempDate = this.event.end!;
            tempDate.setHours(this.endTime.hour, this.endTime.minute);
            let endDate = new Date(tempDate);

            this.fullEvent.title = (document.getElementById("textEvent") as HTMLInputElement).value;
            this.fullEvent.description = (document.getElementById("textDescription") as HTMLInputElement).value;
            this.fullEvent.homework = (document.getElementById("textHomework") as HTMLInputElement).value;
            this.fullEvent.color = new Color({ primary: (document.getElementById("colorEvent") as HTMLInputElement).value });
            this.fullEvent.group = new Group({ id: (document.getElementById("group") as HTMLSelectElement).value });
            this.fullEvent.start = startDate;
            this.fullEvent.end = endDate;

            this.http.put<any>(API_URL + '/lessons/', this.fullEvent, AuthService.getJwtHeaderJSON())
                .subscribe(
                    (result: any) => {
                        this.activeModal.close();
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error.error);
                    }
                );
        } else {
            this.allowToEdit = true;

            this.readGroups();
        }
    }

    validateDates() {
        let tempDate = this.event.start;
        tempDate.setHours(this.startTime.hour, this.startTime.minute);
        let startDate = new Date(tempDate);
        tempDate = this.event.end!;
        tempDate.setHours(this.endTime.hour, this.endTime.minute);
        let endDate = new Date(tempDate);

        if (startDate >= endDate) {
            this.startTime = { hour: this.startTime.hour, minute: this.startTime.minute };
            this.endTime = { hour: this.startTime.hour, minute: this.startTime.minute + 1 };
        }

        let minStart = new Date(this.event.start);
        minStart.setHours(8, 0);
        if (startDate < minStart) {
            this.startTime = { hour: 8, minute: 0 };
        }

        let maxStart = new Date(this.event.start);
        maxStart.setHours(22, 59);
        if (startDate > maxStart) {
            this.startTime = { hour: 22, minute: 59 };
        }

        let minEnd = new Date(this.event.start);
        minEnd.setHours(8, 1);
        if (endDate < minEnd) {
            this.endTime = { hour: 8, minute: 1 };
        }

        let maxEnd = new Date(this.event.start);
        maxEnd.setHours(23, 0);
        if (endDate > maxEnd) {
            this.endTime = { hour: 23, minute: 0 };
        }
    }
}