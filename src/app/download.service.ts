import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../src/environments/environment';
import { FileData } from '../app/models/file-data';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient) {
  }

  download(id: number | undefined): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/users/getDoc/${id}`, {
        headers: AuthService.getJwt(),
        responseType: 'blob'
    });
  }
}