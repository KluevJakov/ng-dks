import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Category } from '../models/category';
import { Group } from '../models/group';
import { User } from '../models/user';
import { ModalViewUser } from './modal-view-user';

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
            <p>Название: <input type="text" id="nameGroup" minlength="1" maxlength="100" value="{{group.name}}" [disabled]="!allowToEdit"></p>
            <p>Направление: 
                <select id="category" [disabled]="!allowToEdit">
                    <option *ngIf="group.category && !allowToEdit" value='{{ group.category.id }}'>{{ group.category.name }}</option>
                    <option *ngIf="!group.category && !allowToEdit">Не определено</option>
                    <ng-container *ngIf="group.category">
                        <option *ngFor='let c of cats' value='{{ c.id }}' [selected]="group.category.id == c.id">{{ c.name }}</option>
                    </ng-container>
                    <ng-container *ngIf="!group.category">
                        <option *ngFor='let c of cats' value='{{ c.id }}' [selected]="c.id == 0">{{ c.name }}</option>
                    </ng-container>
                </select>
            </p>
            <p>Преподаватель: 
                <select id="teacher" [disabled]="!allowToEdit">
                    <option *ngIf="group.teacher && !allowToEdit" value='{{ group.teacher.id }}'>{{group.teacher.surname + " " + group.teacher.name + " " + group.teacher.patronymic}}</option>
                    <option *ngFor="let t of teachers" value='{{ t.id }}' [selected]="group.teacher.id == t.id">{{t.surname + " " + t.name + " " + t.patronymic}}</option>
                </select>
            </p>
            <p>Студенты:</p>
            <div *ngIf="!allowToEdit" style="display: flex;align-items: start;overflow: auto;height: 300px;">
                <table class="table table-bordered table-hover">
                    <tbody>
                        <tr *ngFor="let a of group.students; let i = index;" (click)="readUser(a)"> {{ a.surname + " " + a.name + " " + a.patronymic }} </tr>
                    </tbody>
                </table>
            </div>
            <div *ngIf="allowToEdit" style="display: flex;align-items: start;overflow: auto;height: 300px;">
                <table class="table table-bordered table-hover">
                    <thead>
                        <th style="height: 40px;display: flex;align-items: center;width: 100%;" scope="col">Назначенные</th>
                    </thead>
                    <tbody>
                        <tr *ngFor="let a of approvedStudents; let i = index;" (click)="removeStudent(a, i)"> {{ a.surname + " " + a.name + " " + a.patronymic }} </tr>
                    </tbody>
                </table>
                <table class="table table-bordered table-hover">
                    <thead style="height: 40px;">
                        <th scope="col"><input type="text" id="searchUsersForSelect" style="width: 100%;" placeholder="Поиск.." (keyup)="searchUsers()"></th>
                    </thead>
                    <tbody>
                        <tr scope="row" *ngFor="let s of students; let i = index;" (click)="addStudent(s, i)"> {{ s.surname + " " + s.name + " " + s.patronymic }} </tr>
                    </tbody>
                </table>
            </div>
		</div>
		<div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" *ngIf="currentUser.roles[0].systemName == 'ADMIN'" (click)="editGroup()">Редактировать</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalViewGroup {
    @Input() modalTitle!: string;
    @Input() group!: Group;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    public currentUser: User = JSON.parse(AuthService.getCurrentUser());

    searchRow: string = "";
    cats: Array<Category> = [];
    teachers: Array<User> = [];
    students: Array<User> = [];
    approvedStudents: Array<User> = []; 
    allowToEdit: boolean = false;

    constructor(public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private http: HttpClient) { }

    ngOnInit() {
        this.approvedStudents = this.group.students;
    }

    editGroup() {
        if (this.allowToEdit) {
            this.group.name = (document.getElementById("nameGroup") as HTMLInputElement).value;

            let idCat = parseInt((document.getElementById("category") as HTMLSelectElement).value);
            let idTeacher = parseInt((document.getElementById("teacher") as HTMLSelectElement).value);

            this.group.category = new Category({ id: idCat });
            this.group.teacher = new User({ id: idTeacher });
            this.group.students = this.approvedStudents;

            this.http.put<any>(API_URL + '/groups/', this.group, AuthService.getJwtHeaderJSON())
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

            this.readCats();
            this.readTeachers();
            this.readStudents();
        }
    }

    readUser(user: any) {
        this.http.get<any>(API_URL + '/users/' + user.id, AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.viewUser(result);
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
    }

    viewUser(user: any) {
        const modalRef = this.modalService.open(ModalViewUser, { size: 'lg' });
        modalRef.componentInstance.modalTitle = "Просмотр профиля пользователя";
        modalRef.componentInstance.user = user;
        modalRef.closed.subscribe(e => {
            //
        });
    }

    readCats() {
        this.http.get<any>(API_URL + '/categories/', AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.cats = result;
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
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

    readStudents() {
        this.http.get<any>(API_URL + '/users/byRole/1', AuthService.getJwtHeaderJSON())
            .subscribe(
                (result: any) => {
                    this.students = result;
                    this.students = this.students.filter(e => !this.approvedStudents.find(r => e.id === r.id));
                    this.students = this.students.filter(e => (e.name.toLowerCase().includes(this.searchRow) ||
                        e.surname.toLowerCase().includes(this.searchRow) ||
                        e.patronymic.toLowerCase().includes(this.searchRow)));
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
    }

    removeStudent(student: User, index: number) {
        this.readStudents();
        let selectedIndex = this.approvedStudents.findIndex(e => e.id == student.id);
        let selectedStudent = this.approvedStudents.splice(selectedIndex, 1);
        this.students.push(selectedStudent[0]);
    }

    addStudent(student: User, index: number) {
        this.readStudents();
        let selectedIndex = this.students.findIndex(e => e.id == student.id);
        let selectedStudent = this.students.splice(selectedIndex, 1);
        this.approvedStudents.push(selectedStudent[0]);
    }

    searchUsers() {
        this.readStudents();
        this.searchRow = (event?.target as HTMLInputElement).value.toLowerCase();
    }
}