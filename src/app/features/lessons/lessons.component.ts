import { Component } from '@angular/core';
import { ComingSoonComponent } from '@shared/coming-soon/coming-soon.component';

@Component({
  selector: 'app-lessons',
  imports: [ComingSoonComponent],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
})
export class LessonsComponent {}
