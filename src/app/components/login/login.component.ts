import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { environment } from 'src/environments/environment';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public hasError?: boolean;
  public errorMsg?: string;
  private JwtRequest = class {
    login: string;
    password: string;

    constructor(login: string, password: string){
      this.login = login;
      this.password = password;
    }
  }

  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/profile']);
    }
    this.hasError = false;
    this.errorMsg = "";
  }

  loginAction() {
    let login = (document.getElementById("login") as HTMLInputElement).value;
    let password = (document.getElementById("password") as HTMLInputElement).value;

    let jwtRequestObject = new this.JwtRequest(login, password);
    this.login(JSON.stringify(jwtRequestObject));
  }

  login(body: string) {
    this.http.post<any>(API_URL + '/login', body, AuthService.getHeaderJSON())
      .subscribe(
        (result: any) => {
          sessionStorage.setItem('user', JSON.stringify(result));
          this.router.navigate(['/']);
        },
        (error: HttpErrorResponse) => {
          (document.getElementById("password") as HTMLInputElement).value = '';
          this.hasError = true;
          this.errorMsg = error.error;
        }
      );
  }
}
