import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Role } from '../models/role';
import { User } from '../models/user';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-view-user',
    standalone: true,
    imports: [CommonModule],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <p>Фамилия: <input type="text" id="surname" minlength="1" maxlength="100" required></p>
            <p>Имя: <input type="text" id="name" minlength="1" maxlength="100" required></p>
            <p>Отчество: <input type="text" id="patronymic" minlength="1" maxlength="100" required></p>
            <p>Email: <input type="text" id="email" minlength="1" maxlength="100" required></p>
            <p>Логин: <input type="text" id="login" minlength="1" maxlength="100" required></p>
            <p>Телефон: <input type="phone" id="contact" minlength="1" maxlength="100" required></p>
            <p>Роль: 
                <select id="role">
                    <option>{{ this.user.roles[0].displayName }}</option>
                </select>
            </p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalViewUser {
    @Input() modalTitle!: string;
    @Input() user!: User;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    roles: Array<Role> = [];

    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient) { }

    ngOnInit() {
        this.readRoles();

        (document.getElementById("surname") as HTMLInputElement).disabled = true;
        (document.getElementById("name") as HTMLInputElement).disabled = true;
        (document.getElementById("patronymic") as HTMLInputElement).disabled = true;
        (document.getElementById("email") as HTMLInputElement).disabled = true;
        (document.getElementById("login") as HTMLInputElement).disabled = true;
        (document.getElementById("contact") as HTMLInputElement).disabled = true;
        (document.getElementById("role") as HTMLInputElement).disabled = true;

        (document.getElementById("surname") as HTMLInputElement).value = this.user.surname;
        (document.getElementById("name") as HTMLInputElement).value = this.user.name;
        (document.getElementById("patronymic") as HTMLInputElement).value = this.user.patronymic;
        (document.getElementById("email") as HTMLInputElement).value = this.user.email;
        (document.getElementById("login") as HTMLInputElement).value = this.user.login;
        (document.getElementById("contact") as HTMLInputElement).value = this.user.contact;
    }

    readRoles() {
        this.http.get<any>(API_URL + '/roles/limitedRoles', AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.roles = result;
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
    }
}