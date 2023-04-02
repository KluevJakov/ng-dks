import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { CustomDateFormatter } from '../../custom-date-formatter.provider';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { collapseAnimation } from 'angular-calendar';
import { ModalCreateEvent } from 'src/app/modals/modal-create-event';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { ModalViewEvent } from 'src/app/modals/modal-view-event';
import { User } from 'src/app/models/user';

const API_URL: string = environment.apiUrl;

registerLocaleData(localeRu);

@Component({
  selector: 'app-calendar-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-block.component.html',
  styleUrls: ['./calendar-block.component.css'],
  animations: [collapseAnimation],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class CalendarBlockComponent {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;
  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  user?: User;
  public currentUser: User = JSON.parse(AuthService.getCurrentUser());

  constructor(private modalService: NgbModal,
    private http: HttpClient) { }

  ngOnInit() {
    this.refreshScedule();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  addEvent(event: CalendarEvent): void {
    if (this.events.some(e => e.id === event.id)) {
      return;
    }
      this.events.push({
        id: event.id,
        start: new Date(event.start),
        end: new Date(event.end!),
        title: event.title,
        color: event.color,
        allDay: false,
      });
      this.refresh.next();
  }

  onOpen(date: Date) {
    if (this.currentUser.roles[0].systemName == 'ADMIN') {
      const modalRef = this.modalService.open(ModalCreateEvent, { size: 'lg' });
      modalRef.componentInstance.modalTitle = "Создать новое занятие";
      modalRef.componentInstance.date = date;
      modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
        this.addEvent(receivedEntry);

        this.http.post<any>(API_URL + '/lessons/', receivedEntry, AuthService.getJwtHeaderJSON())
          .subscribe(
            (result: any) => {
              this.refreshScedule();
            },
            (error: HttpErrorResponse) => {
              console.log(error.error);
            }
          );
        modalRef.dismiss();
      });
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    const modalRef = this.modalService.open(ModalViewEvent, { size: 'lg' });
    modalRef.componentInstance.modalTitle = "Событие: " + event.title;
    modalRef.componentInstance.event = event;
    modalRef.closed.subscribe(e => {
      this.refreshScedule();
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  refreshScedule() {
    this.events = new Array();
    
    this.http.get<any>(API_URL + '/profile', AuthService.getJwtHeaderJSON())
    .subscribe(
      (result: any) => {
        this.user = new User(result);
        if (this.user?.paymentStatus || this.user.roles[0].systemName != "STUDENT") {
          this.http.get<any>(API_URL + '/lessons/', AuthService.getJwtHeaderJSON())
            .subscribe(
              (result: any) => {
                
                result.forEach((e: CalendarEvent<any>) => this.addEvent(e));
              },
              (error: HttpErrorResponse) => {
                console.log(error.error);
              }
            );
        } 
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }
}
