import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Category } from '../models/category';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-view-cat',
    standalone: true,
    imports: [CommonModule],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <p>Название: <input type="text" id="nameCategory" minlength="1" maxlength="100" value="{{ category.name }}" [disabled]="!allowToEdit"></p>
		</div>
		<div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" (click)="editCat()">Редактировать</button>
            <button type="button" class="btn btn-outline-dark" (click)="deleteCat()">Удалить</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalViewCat {
    @Input() modalTitle!: string;
    @Input() category!: Category;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    allowToEdit: boolean = false;

    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient) { }

    ngOnInit() {

    }

    editCat() {
        if (this.allowToEdit) {
            this.category.name = (document.getElementById("nameCategory") as HTMLInputElement).value;
            
            this.http.put<any>(API_URL + '/categories/', this.category, AuthService.getJwtHeaderJSON())
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

    deleteCat() {
        if (confirm("Вы уверены, что хотите удалить направление? Оно будет отвязано от занятий, за которыми было закреплено")) {
            this.http.delete<any>(API_URL + '/categories/' + this.category.id, AuthService.getJwtHeaderJSON())
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
}