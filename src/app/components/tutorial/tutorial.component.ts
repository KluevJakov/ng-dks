import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent {
  public currentUser: User = JSON.parse(AuthService.getCurrentUser());
}
