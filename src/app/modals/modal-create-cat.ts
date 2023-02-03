import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Category } from '../models/category';
import { Role } from '../models/role';
import { User } from '../models/user';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-create-cat',
    standalone: true,
    imports: [CommonModule],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ modalTitle }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <p>Название: <input type="text" id="name" minlength="1" maxlength="100" required> </p>
		</div>
		<div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" (click)="createCat()">Создать</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalCreateCat {
    @Input() modalTitle!: string;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    category: Category = new Category({});

    constructor(public activeModal: NgbActiveModal,
        private http: HttpClient) { }

    ngOnInit() {
        
    }

    createCat() {
        this.category.name = (document.getElementById("name") as HTMLInputElement).value;
        
        this.http.post<any>(API_URL + '/cats/create', this.category, AuthService.getJwtHeaderJSON())
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
}