import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { ModalCreateCat } from 'src/app/modals/modal-create-cat';
import { ModalCreateGroup } from 'src/app/modals/modal-create-group';
import { ModalViewCat } from 'src/app/modals/modal-view-cat';
import { ModalViewGroup } from 'src/app/modals/modal-view-group';
import { Category } from 'src/app/models/category';
import { Group } from 'src/app/models/group';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-group-block',
  templateUrl: './group-block.component.html',
  styleUrls: ['./group-block.component.css']
})
export class GroupBlockComponent {

  public groups: Array<Group> = [];
  public cats: Array<Category> = [];
  public currentCat?: number = -1;
  public currentUser: User = JSON.parse(AuthService.getCurrentUser());

  constructor(private modalService: NgbModal,
    private http: HttpClient) {}

  ngOnInit(){
    this.filterGroups(-1);
    this.readCategories();
  }

  filterGroups(filterCat : number) {
    this.currentCat = filterCat;
    this.http.get<any>(API_URL + '/groups/byCat/' + filterCat, AuthService.getJwtHeaderJSON())
      .subscribe(
        (result: any) => {
          this.groups = result;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  readCategories() {
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

  readGroup(group : any) {
    this.http.get<any>(API_URL + '/groups/' + group.id, AuthService.getJwtHeaderJSON())
      .subscribe(
        (result: any) => {
          this.viewGroup(result);
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  searchGroups() {
    let searchRow = (document.getElementById("searchGroup") as HTMLInputElement).value;

    this.http.get<any>(API_URL + '/groups/byCat/' + this.currentCat + '?search=' + searchRow, AuthService.getJwtHeaderJSON())
      .subscribe(
        (result: any) => {
          this.groups = result;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  createGroup() {
    const modalRef = this.modalService.open(ModalCreateGroup, { size: 'lg' });
    modalRef.componentInstance.modalTitle = "Создание новой группы";
    modalRef.closed.subscribe(e => {
      this.searchGroups();
    });
  }

  createCat() {
    const modalRef = this.modalService.open(ModalCreateCat, { size: 'lg' });
    modalRef.componentInstance.modalTitle = "Создание нового направления";
    modalRef.closed.subscribe(e => {
      this.readCategories();
    });
  }

  viewGroup(group: any) {
    const modalRef = this.modalService.open(ModalViewGroup, { size: 'lg' });
    modalRef.componentInstance.modalTitle = "Просмотр группы";
    modalRef.componentInstance.group = group;
    modalRef.closed.subscribe(e => {
      this.searchGroups();
    });
  }

  viewCategory(category: any) {
    const modalRef = this.modalService.open(ModalViewCat, { size: 'lg' });
    modalRef.componentInstance.modalTitle = "Просмотр направления";
    modalRef.componentInstance.category = category;
    modalRef.closed.subscribe(e => {
      this.readCategories();
      this.currentCat = -1;
      this.searchGroups();
    });
  }
}
