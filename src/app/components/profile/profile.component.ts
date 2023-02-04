import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user?: User;

  constructor(private http: HttpClient,
    private router: Router) {
    
  }

  ngOnInit(): void {
    this.http.get<any>(API_URL + '/profile', AuthService.getJwtHeaderJSON())
    .subscribe(
      (result: any) => {
        this.user = new User(result);
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }
}
