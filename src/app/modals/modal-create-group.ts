import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Category } from '../models/category';
import { Group } from '../models/group';
import { User } from '../models/user';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-create-group',
    standalone: true,
    imports: [CommonModule],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <p>Название: <input type="text" id="nameGroup" minlength="1" maxlength="100" required></p>
            <p>Назначить направление: 
                <select id="category">
                    <option *ngFor="let c of cats" value='{{ c.id }}'>{{ c.name }}</option>
                </select>
            </p>
            <p>Назначить преподавателя: 
                <select id="teacher">
                    <option *ngFor="let t of teachers" value='{{ t.id }}'>{{t.surname + " " + t.name + " " + t.patronymic}}</option>
                </select>
            </p>
            <p>Назначить студентов:</p>
            <div style="display: flex;align-items: start;overflow: auto;height: 300px;">
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
            <button type="button" class="btn btn-outline-dark" (click)="createGroup()">Создать</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalCreateGroup {
    @Input() modalTitle!: string;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    searchRow: string = "";
    cats: Array<Category> = [];
    teachers: Array<User> = [];
    students: Array<User> = [];
    approvedStudents: Array<User> = [];


    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient) { }

    ngOnInit() {
        this.readCats();
        this.readTeachers();
        this.readStudents();
    }

    createGroup() {
        let group = new Group({});
        group.name = (document.getElementById("nameGroup") as HTMLInputElement).value;

        let idCat = parseInt((document.getElementById("category") as HTMLSelectElement).value);
        let idTeacher = parseInt((document.getElementById("teacher") as HTMLSelectElement).value);

        group.category = new Category({ id: idCat });
        group.teacher = new User({ id: idTeacher });
        group.students = this.approvedStudents;

        this.http.post<any>(API_URL + '/groups/', group, AuthService.getJwtHeaderJSON())
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
}