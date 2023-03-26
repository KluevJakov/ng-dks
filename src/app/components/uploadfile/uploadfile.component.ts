import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, NgModule, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.css'],
  imports: [NgxFileDropModule, CommonModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class UploadfileComponent implements OnInit {
  @Input() modalTitle!: string;
  @Input() user!: User;

  data: FormData = new FormData();
  public files: NgxFileDropEntry[] = [];
  isLoading: boolean = false;
  isFilesReadyForDownload: boolean = false;
  hasResult: boolean = false;

  static ExecResult = class {
    text: string;
    execTime: number;
    files: number;
    progress: number;
    urlResult: string;
    constructor(data: any){
      this.text = data.text;
      this.execTime = data.execTime;
      this.files = data.files;
      this.progress = data.progress;
      this.urlResult = data.urlResult;
    }
  }

  execResult = new UploadfileComponent.ExecResult("");

  constructor(private http: HttpClient,
    private authService: AuthService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  @Input()
  public create = false;

  @Output()
  public modalClosed: EventEmitter<void> = new EventEmitter<void>();


  close(): void {
    this.modalClosed.emit();
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;

    for (const droppedFile of this.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.data.append('files', file);
        });
      }
    }

    if (this.files.length != 0) {
      this.isFilesReadyForDownload = true;
    } else {
      this.isFilesReadyForDownload = false;
    }
  }

  public upload() {
    if (this.files.length != 0) {
      this.isLoading = true;
      this.data.append('user', JSON.stringify(this.user));
      this.http.post<any>(API_URL + '/users/loadFiles', this.data, AuthService.getJwtHeaderPlain())
        .subscribe(
          (result: any) => {
            this.isLoading = false;
            this.hasResult = true;
            this.execResult = new UploadfileComponent.ExecResult(result);
          },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          }
        );
    } else {
      alert("Сначала загрузите файлы");
    }
    this.files = [];
    this.data = new FormData();
    this.isFilesReadyForDownload = false;
  }

  public fileOver(event: any) {
    //console.log(event);
  }

  public fileLeave(event: any) {
    //console.log(event);
  }
}
