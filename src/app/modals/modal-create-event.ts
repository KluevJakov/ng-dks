import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Group } from '../models/group';
import { User } from '../models/user';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-create-event',
    standalone: true,
    imports: [CommonModule],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <p>День занятия: {{ dateOfLesson }}</p>
            <p>Начало занятия: <input type="time" min="08:00" max="23:00" timeformat="24h" id="startTime" required></p>
            <p>Конец занятия: <input type="time" min="08:00" max="23:00" id="endTime" required></p>
            <p>Цвет метки: <input type="color" id="colorEvent" required></p>
            <p>Назовите событие: <input type="text" id="textEvent" minlength="1" maxlength="100" required></p>
            <p>Описание события: </p>
            <textarea id="textDescription" minlength="1" maxlength="2000" style="width: 100%; margin-bottom: 20px"></textarea>
            <p>Назначить группу: 
                <select id="group">
                    <option *ngFor="let g of groups" value='{{ g.id }}'>{{ g.name }}</option>
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

    constructor(public activeModal: NgbActiveModal, private http: HttpClient) { }

    ngOnInit() {
        this.dateOfLesson = this.date.toLocaleString("ru-RU", { weekday: "long", month: "long", day: "numeric" });
        (document.getElementById("startTime") as HTMLInputElement).value = this.date.toLocaleTimeString("ru-RU", { minute: "numeric", hour: "numeric" });
        (document.getElementById("endTime") as HTMLInputElement).value = this.date.toLocaleTimeString("ru-RU", { minute: "numeric", hour: "numeric" });

        this.readTeachers();
        this.readGroups();
    }

    createEvent() {
        let sH = parseInt((document.getElementById("startTime") as HTMLInputElement).value.substring(0, 2));
        let sM = parseInt((document.getElementById("startTime") as HTMLInputElement).value.substring(3, 5));
        let eH = parseInt((document.getElementById("endTime") as HTMLInputElement).value.substring(0, 2));
        let eM = parseInt((document.getElementById("endTime") as HTMLInputElement).value.substring(3, 5));

        let tempDate = this.date;
        tempDate.setHours(sH, sM);
        let startDate = new Date(tempDate);
        tempDate = this.date;
        tempDate.setHours(eH, eM);
        let endDate = new Date(tempDate);

        if (!(document.getElementById("textEvent") as HTMLInputElement).value) {
            (document.getElementById("textEvent") as HTMLInputElement).setCustomValidity("Заголовок мероприятия - обязательный параметр");
            (document.getElementById("textEvent") as HTMLInputElement).reportValidity();
            return;
        }

        if (!startDate) {
            (document.getElementById("startTime") as HTMLInputElement).setCustomValidity("Время начала - обязательный параметр");
            (document.getElementById("startTime") as HTMLInputElement).reportValidity();
            return;
        }

        if (!endDate) {
            (document.getElementById("endTime") as HTMLInputElement).setCustomValidity("Время окончания - обязательный параметр");
            (document.getElementById("endTime") as HTMLInputElement).reportValidity();
            return;
        }

        if (startDate >= endDate) {
            (document.getElementById("startTime") as HTMLInputElement).setCustomValidity("Время начала позже или равна времени окончания");
            (document.getElementById("startTime") as HTMLInputElement).reportValidity();
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
            group: { id: (document.getElementById("group") as HTMLSelectElement).value}
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
}