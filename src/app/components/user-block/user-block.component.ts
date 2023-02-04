import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { ModalCreateUser } from 'src/app/modals/modal-create-user';
import { ModalViewUser } from 'src/app/modals/modal-view-user';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-user-block',
  templateUrl: './user-block.component.html',
  styleUrls: ['./user-block.component.css']
})
export class UserBlockComponent {

  public users: Array<User> = [];
  public currentRole: number = 2;

  constructor(private modalService: NgbModal,
    private http: HttpClient) {}

  ngOnInit(){
    this.searchUsers();
  }

  filterUsers(filterRole : number) {
    this.currentRole = filterRole;
    this.http.get<any>(API_URL + '/users/byRole/' + filterRole, AuthService.getJwtHeaderJSON())
      .subscribe(
        (result: any) => {
          this.users = result;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  readUser(user : any) {
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

  searchUsers() {
    let searchRow = (event?.target as HTMLInputElement).value;

    if (!searchRow) {
      searchRow = "";
    }

    this.http.get<any>(API_URL + '/users/byRole/' + this.currentRole + '?search=' + searchRow, AuthService.getJwtHeaderJSON())
      .subscribe(
        (result: any) => {
          this.users = result;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  createUser() {
    const modalRef = this.modalService.open(ModalCreateUser, { size: 'lg' });
    modalRef.componentInstance.modalTitle = "Создание нового пользователя";
    modalRef.closed.subscribe(e => {
      this.searchUsers();
    });
  }

  viewUser(user: any) {
    const modalRef = this.modalService.open(ModalViewUser, { size: 'lg' });
    modalRef.componentInstance.modalTitle = "Просмотр профиля пользователя";
    modalRef.componentInstance.user = user;
    modalRef.closed.subscribe(e => {
      this.searchUsers();
    });
  }
}
