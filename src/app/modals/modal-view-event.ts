import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Lesson } from '../models/lesson';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-view-event',
    standalone: true,
    template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <p>День занятия: {{ dateOfLesson }}</p>
            <p>Начало занятия: <input type="time" id="startTime" required></p>
            <p>Конец занятия: <input type="time" id="endTime" required></p>
            <p>Цвет метки: <input type="color" id="colorEvent" required></p>
            <p>Назование события: <input type="text" id="textEvent" minlength="1" maxlength="100" required></p>
            <p>Описание события: </p>
            <textarea id="textDescription" minlength="1" maxlength="2000" style="width: 100%; margin-bottom: 20px"></textarea>
            <p>Привязанная группа: 
                <select id="group">
                    <option value='{{ fullEvent.group.id }}'>{{ fullEvent.group.name }}</option>
                </select>
            </p>
		</div>
		<div class="modal-footer">
            <button type="button" class="btn btn-outline-dark">Редактировать</button>
            <button type="button" class="btn btn-outline-dark" (click)="deleteEvent()">Удалить</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalViewEvent {
    @Input() modalTitle!: string;
    @Input() event!: CalendarEvent;
    fullEvent: Lesson = new Lesson({});

    dateOfLesson: any;

    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient) { }

    ngOnInit() {
        this.readEvent();

        this.dateOfLesson = this.event.start.toLocaleString("ru-RU", { weekday: "long", month: "long", day: "numeric" });
        (document.getElementById("startTime") as HTMLInputElement).value = this.event.start.toLocaleTimeString("ru-RU", { minute: "numeric", hour: "numeric" });
        (document.getElementById("endTime") as HTMLInputElement).value = this.event.end!.toLocaleTimeString("ru-RU", { minute: "numeric", hour: "numeric" });
        (document.getElementById("textEvent") as HTMLInputElement).value = this.event.title;
        (document.getElementById("colorEvent") as HTMLInputElement).value = this.event.color?.primary!;

        (document.getElementById("startTime") as HTMLInputElement).disabled = true;
        (document.getElementById("endTime") as HTMLInputElement).disabled = true;
        (document.getElementById("textEvent") as HTMLInputElement).disabled = true;
        (document.getElementById("colorEvent") as HTMLInputElement).disabled = true;
        (document.getElementById("textDescription") as HTMLInputElement).disabled = true;
        (document.getElementById("group") as HTMLSelectElement).disabled = true;
    }

    readEvent() {
        this.http.get<any>(API_URL + '/lesson/' + this.event.id, AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.fullEvent = result;
                    (document.getElementById("textDescription") as HTMLInputElement).value = this.fullEvent.description;
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
    }

    deleteEvent() {
        if (confirm("Вы уверены?")) {
            this.http.delete<any>(API_URL + '/lesson/' + this.event.id, AuthService.getJwtHeaderJSON())
                .subscribe(
                    (result: any) => {
                        console.log(result);
                        this.activeModal.close();
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error.error);
                    }
                );
        }
    }
}