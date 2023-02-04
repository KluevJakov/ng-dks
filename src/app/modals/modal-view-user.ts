import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
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
            <p>Фамилия: <input type="text" id="surnameUser" minlength="1" maxlength="100" value="{{user.surname}}" [disabled]="!allowToEdit"></p>
            <p>Имя: <input type="text" id="nameUser" minlength="1" maxlength="100" value="{{user.name}}" [disabled]="!allowToEdit"></p>
            <p>Отчество: <input type="text" id="patronymicUser" minlength="1" maxlength="100" value="{{user.patronymic}}" [disabled]="!allowToEdit"></p>
            <p>Email: <input type="text" id="emailUser" minlength="1" maxlength="100" value="{{user.email}}" [disabled]="!allowToEdit"></p>
            <p>Логин: <input type="text" id="loginUser" minlength="1" maxlength="100" value="{{user.login}}" [disabled]="!allowToEdit"></p>
            <p>Телефон: <input type="phone" id="contactUser" minlength="1" maxlength="100" value="{{user.contact}}" [disabled]="!allowToEdit"></p>
            <p>Роль: 
                <select id="role" disabled>
                    <option>{{ this.user.roles[0].displayName }}</option>
                </select>
            </p>
		</div>
		<div class="modal-footer">
            <button type="button" class="btn" 
                [ngClass]="{'btn-outline-danger' : user.paymentStatus, 
                        'btn-outline-success' : !user.paymentStatus}" 
                *ngIf="currentUser.roles[0].systemName == 'ADMIN'" 
                (click)="paymentUser()">
                {{user.paymentStatus ? "Не оплачено" : "Оплачено"}}
            </button>
            <button type="button" class="btn" 
                [ngClass]="{'btn-outline-danger' : user.active, 
                        'btn-outline-success' : !user.active}" 
                *ngIf="currentUser.roles[0].systemName == 'ADMIN'" 
                (click)="activateUser()">
                {{user.active ? "Деактивировать" : "Активировать"}}
            </button>
            <button type="button" class="btn btn-outline-dark" *ngIf="currentUser.roles[0].systemName == 'ADMIN'" (click)="editUser()">Редактировать</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalViewUser {
    @Input() modalTitle!: string;
    @Input() user!: User;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    public currentUser: User = JSON.parse(AuthService.getCurrentUser());

    allowToEdit: boolean = false;

    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient) { }

    ngOnInit() {

    }

    activateUser() {
        this.http.post<any>(API_URL + '/users/swapActive', this.user, AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.activeModal.close();
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
    }

    paymentUser() {
        this.http.post<any>(API_URL + '/users/paymentCheck', this.user, AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.activeModal.close();
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
    }

    editUser() {
        if (this.allowToEdit) {
            this.user.surname = (document.getElementById("surnameUser") as HTMLInputElement).value;
            this.user.name = (document.getElementById("nameUser") as HTMLInputElement).value;
            this.user.patronymic = (document.getElementById("patronymicUser") as HTMLInputElement).value;
            this.user.email = (document.getElementById("emailUser") as HTMLInputElement).value;
            this.user.login = (document.getElementById("loginUser") as HTMLInputElement).value;
            this.user.contact = (document.getElementById("contactUser") as HTMLInputElement).value;

            this.http.put<any>(API_URL + '/users/', this.user, AuthService.getJwtHeaderJSON())
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
        }
    }
}