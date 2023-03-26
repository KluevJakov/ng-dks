import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { UploadfileComponent } from '../components/uploadfile/uploadfile.component';
import { Document } from '../models/document';
import { User } from '../models/user';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-view-user',
    standalone: true,
    imports: [CommonModule, UploadfileComponent],
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
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">№</th>
                            <th scope="col">Документ</th>
                            <th scope="col">Удалить</th>
                            <th scope="col">Скачать</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let doc of docs; let i = index">
                            <th scope="row">{{ i+1 }}</th>
                            <td>{{ doc.name }}</td>
                            <td><span (click)="deleteAtt(doc)">Удалить</span></td>
                            <td><span (click)="downloadAtt(doc)">Скачать</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</div>
		<div class="modal-footer">
            <div class="form-check"
            *ngIf="currentUser.roles[0].systemName == 'ADMIN' && user.roles[0].systemName == 'STUDENT'">
                <input class="form-check-input" type="checkbox" id="flexCheckDefault"
                (click)="paymentUser()" [checked]="user.paymentStatus">
                <label class="form-check-label" for="flexCheckDefault">
                    Статус оплаты
                </label>
            </div>

            <button type="button" class="btn btn-outline-dark" (click)="uploadFiles()">Прикрепить файлы</button>

            <button type="button" class="btn btn-outline-dark" *ngIf="currentUser.roles[0].systemName == 'ADMIN'" (click)="editUser()">Редактировать</button>
            <button type="button" class="btn btn-outline-dark" *ngIf="currentUser.roles[0].systemName == 'ADMIN'" (click)="removeUser()">Удалить</button>
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
    docs!: Array<Document>;

    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient,
        private authService: AuthService,
        private modalService: NgbModal) { }

    ngOnInit() {
        this.loadAttachments();
    }

    downloadAtt(doc: Document) {

    }

    deleteAtt(doc: Document) {
        this.http.delete<any>(API_URL + '/users/delLink/' + doc.id, AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.loadAttachments();
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
    }

    loadAttachments() {
        this.http.get<any>(API_URL + '/users/docLinks/' + this.user.id, AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.docs = result;
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
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

    uploadFiles(): void {
        const modalRef = this.modalService.open(UploadfileComponent, { size: 'lg' });
        modalRef.componentInstance.modalTitle = "Загрузка";
        modalRef.componentInstance.user = this.user;
        modalRef.closed.subscribe(e => {
            this.loadAttachments();
        });
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

    removeUser() {
        if (confirm("Вы уверены?")) {
            this.http.delete<any>(API_URL + '/users/' + this.user.id, AuthService.getJwtHeaderJSON())
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