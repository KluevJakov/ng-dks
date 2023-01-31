import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { ModalCreateUser } from 'src/app/modals/modal-create-user';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/ environment';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-user-block',
  templateUrl: './user-block.component.html',
  styleUrls: ['./user-block.component.css']
})
export class UserBlockComponent {

  public users: Array<User> = [];

  constructor(private modalService: NgbModal,
    private http: HttpClient) {}

  ngOnInit(){
    this.filterUsers(2);
  }

  filterUsers(filterRole : number) {
    this.http.get<any>(API_URL + '/user/usersByRole/' + filterRole, AuthService.getJwtHeaderJSON())
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
    this.http.get<any>(API_URL + '/user/' + user.id, AuthService.getJwtHeaderJSON())
      .subscribe(
        (result: any) => {
          console.log(result);
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  createUser() {
    const modalRef = this.modalService.open(ModalCreateUser, { size: 'lg' });
    modalRef.componentInstance.modalTitle = "Создание нового пользователя";
  }
}
