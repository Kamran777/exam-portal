import { Component } from '@angular/core';
import { ComingSoonComponent } from '@shared/coming-soon/coming-soon.component';

@Component({
  selector: 'app-students',
  imports: [ComingSoonComponent],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent {}
