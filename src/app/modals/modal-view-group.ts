import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Group } from '../models/group';
import { Role } from '../models/role';
import { User } from '../models/user';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-view-group',
    standalone: true,
    imports: [CommonModule],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <p>Название: <input type="text" id="name" minlength="1" maxlength="100" value="{{group.name}}" required></p>
            <p>Направление: 
                <select id="category">
                    <option value='{{ group.category.id }}'>{{ group.category.name }}</option>
                </select>
            </p>
            <p>Преподаватель: 
                <select id="teacher">
                    <option value='{{ group.teacher.id }}'>{{group.teacher.surname + " " + group.teacher.name + " " + group.teacher.patronymic}}</option>
                </select>
            </p>
            <p>Студенты:</p>
            <div style="display: flex;align-items: start;overflow: auto;height: 300px;">
                <table class="table table-bordered table-hover">
                    <tbody>
                        <tr *ngFor="let a of group.students; let i = index;"> {{ a.surname + " " + a.name + " " + a.patronymic }} </tr>
                    </tbody>
                </table>
            </div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalViewGroup {
    @Input() modalTitle!: string;
    @Input() group!: Group;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient) { }

    ngOnInit() {
        (document.getElementById("name") as HTMLInputElement).disabled = true;
        (document.getElementById("category") as HTMLInputElement).disabled = true;
        (document.getElementById("teacher") as HTMLInputElement).disabled = true;
    }
}