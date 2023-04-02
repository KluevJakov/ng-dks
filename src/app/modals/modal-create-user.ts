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
    selector: 'modal-create-user',
    standalone: true,
    imports: [CommonModule],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <p>Логин: <input type="text" id="login" minlength="1" maxlength="100" required> </p>
            <p>Пароль: <input type="password" id="password" minlength="1" maxlength="100" required> </p>
            <p>Повторить пароль: <input type="password" id="passwordAccept" minlength="1" maxlength="100" required> </p>
            
            <ng-container *ngIf="studentFields">
                <label for="studentBlock1">Данные студента: </label>
                <div class="card p-2 mb-3" id="studentBlock1">
                    <p>Фамилия студента: <input type="text" id="surname" minlength="1" maxlength="100" required> </p>
                    <p>Имя студента: <input type="text" id="name" minlength="1" maxlength="100" required> </p>
                    <p>Отчество студента: <input type="text" id="patronymic" minlength="1" maxlength="100" required> </p>
                    <p>День рождения: <input type="date" id="childBirthday" required> </p>
                </div>
                <p>Наличие паспорта: <input type="checkbox" (change)="adult()" id="isAdult" required> </p>
                <ng-container *ngIf="isAdult">
                    <label for="studentBlock2">Паспорт студента: </label>
                    <div class="card p-2 mb-3" id="studentBlock2">
                        <p>Серия: <input type="text" id="childSerialId" minlength="4" maxlength="4" required> </p>
                        <p>Номер: <input type="text" id="childNumberId" minlength="6" maxlength="6" required> </p>
                        <p>Кем выдан: <input type="text" id="childDepId" minlength="1" maxlength="60" required> </p>
                        <p>Дата выдачи: <input type="date" id="childDateId" required> </p>
                    </div>
                </ng-container>
                <ng-container *ngIf="!isAdult">
                    <label for="studentBlock3">Свидетельство о рождении студента: </label>
                    <div class="card p-2 mb-3" id="studentBlock3">
                        <p>Серия: <input type="text" id="childSerialCert" minlength="1" maxlength="8" required> </p>
                        <p>Номер: <input type="text" id="childNumberCert" minlength="1" maxlength="15" required> </p>
                        <p>Дата выдачи: <input type="date" id="childDateCert" required> </p>
                    </div>
                </ng-container>
                <ng-container>
                    <label for="studentBlock4">Данные родителя: </label>
                    <div class="card p-2 mb-3" id="studentBlock4">
                        <p>Ф.И.О.: <input type="text" id="parentFio" minlength="1" maxlength="100" required> </p>
                        <p>День рождения: <input type="date" id="parentBirthday" required> </p>
                        <p>Адрес: <input type="text" id="parentAddress" minlength="1" maxlength="150" required> </p>
                        <p>Телефон: <input type="phone" id="parentContact" minlength="1" maxlength="100" required> </p>
                    </div>
                    <label for="studentBlock5">Паспорт родителя: </label>
                    <div class="card p-2 mb-3" id="studentBlock5">
                        <p>Серия: <input type="text" id="parentSerialId" minlength="4" maxlength="4" required> </p>
                        <p>Номер: <input type="text" id="parentNumberId" minlength="6" maxlength="6" required> </p>
                        <p>Кем выдан: <input type="text" id="parentDepId" minlength="1" maxlength="60" required> </p>
                        <p>Дата выдачи: <input type="date" id="parentDateId" required> </p>
                    </div>
                </ng-container>
            </ng-container>

            <ng-container *ngIf="!studentFields">
                <p>Фамилия: <input type="text" id="surname" minlength="1" maxlength="100" required> </p>
                <p>Имя: <input type="text" id="name" minlength="1" maxlength="100" required> </p>
                <p>Отчество: <input type="text" id="patronymic" minlength="1" maxlength="100" required> </p>
                <p>Телефон: <input type="phone" id="parentContact" minlength="1" maxlength="100" required> </p>
            </ng-container>
            <p>Назначить роль: 
                <select (change)="roleChange()" id="role">
                    <option *ngFor="let r of roles" value='{{ r.id }}'>{{ r.displayName }}</option>
                </select>
            </p>
		</div>
		<div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" (click)="createUser()">Создать</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalCreateUser {
    @Input() modalTitle!: string;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    roles: Array<Role> = [];
    user: User = new User({});
    studentFields: boolean = true;
    isAdult: boolean = false;

    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient) { }

    ngOnInit() {
        this.readRoles();
    }

    adult() {
        this.isAdult = (event?.target as HTMLInputElement).checked;
    }

    roleChange() {
        let roleChanged = (document.getElementById("role") as HTMLSelectElement).selectedOptions[0].innerText;
        if (roleChanged == "Студент") {
            this.studentFields = true;
        } else {
            this.studentFields = false;
        }
    }

    createUser() {
        this.user.surname = (document.getElementById("surname") as HTMLInputElement).value;
        this.user.name = (document.getElementById("name") as HTMLInputElement).value;
        this.user.patronymic = (document.getElementById("patronymic") as HTMLInputElement).value;
        this.user.login = (document.getElementById("login") as HTMLInputElement).value;
        this.user.parentContact = (document.getElementById("parentContact") as HTMLInputElement).value;
        this.user.password = (document.getElementById("password") as HTMLInputElement).value;
        this.user.passwordAccept = (document.getElementById("passwordAccept") as HTMLInputElement).value;

        if (this.studentFields) {
            this.user.childBirthday = new Date((document.getElementById("childBirthday") as HTMLInputElement).value);

            this.user.parentFio = (document.getElementById("parentFio") as HTMLInputElement).value;
            this.user.parentBirthday = new Date((document.getElementById("parentBirthday") as HTMLInputElement).value);
            this.user.parentAddress = (document.getElementById("parentAddress") as HTMLInputElement).value;
            this.user.parentSerialId = (document.getElementById("parentSerialId") as HTMLInputElement).value;
            this.user.parentNumberId = (document.getElementById("parentNumberId") as HTMLInputElement).value;
            this.user.parentDepId = (document.getElementById("parentDepId") as HTMLInputElement).value;
            this.user.parentDateId = new Date((document.getElementById("parentDateId") as HTMLInputElement).value);

            if (this.isAdult) {
                this.user.childSerialId = (document.getElementById("childSerialId") as HTMLInputElement).value;
                this.user.childNumberId = (document.getElementById("childNumberId") as HTMLInputElement).value;
                this.user.childDepId = (document.getElementById("childDepId") as HTMLInputElement).value;
                this.user.childDateId = new Date((document.getElementById("childDateId") as HTMLInputElement).value);
            } else {
                this.user.childSerialCert = (document.getElementById("childSerialCert") as HTMLInputElement).value;
                this.user.childNumberCert = (document.getElementById("childNumberCert") as HTMLInputElement).value;
                this.user.childDateCert = new Date((document.getElementById("childDateCert") as HTMLInputElement).value);
            }
        }

        let idRole = parseInt((document.getElementById("role") as HTMLSelectElement).value);
        let role = new Array<Role>();
        role.push({ id: idRole, displayName: '', systemName: ''})

        this.user.roles = role;

        this.http.post<any>(API_URL + '/users/', this.user, AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    console.log(result.error);
                    this.activeModal.close();
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
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