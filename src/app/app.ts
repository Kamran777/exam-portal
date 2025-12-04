import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { NavigationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Exam } from '@core/models/exam';
import { Lesson } from '@core/models/lesson';
import { Student } from '@core/models/student';
import { StateService } from '@core/services/state.service';
import { EXAM_STATE, LESSON_STATE, STUDENT_STATE } from '@core/state/state.token';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

interface Brand {
  initials: string;
  name: string;
  footer: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly brand: Brand = {
    initials: 'K',
    name: 'SHUKURZADE',
    footer: 'Made by Kamran Shukurzade',
  };

  readonly menuItems: MenuItem[] = [
    { label: 'İmtahanlar', icon: 'fa fa-edit', route: '/exams' },
    { label: 'Dərslər', icon: 'fa fa-book-open', route: '/lessons' },
    { label: 'Şagirdlər', icon: 'fa fa-user-graduate', route: '/students' },
    { label: 'Qeydiyyat', icon: 'fa fa-sign', route: '/register' },
  ];
  constructor(
    private router: Router,
    @Inject(LESSON_STATE) private lessonState: StateService<Lesson>,
    @Inject(STUDENT_STATE) private studentState: StateService<Student>,
    @Inject(EXAM_STATE) private examState: StateService<Exam>
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.lessonState.clear();
        this.studentState.clear();
        this.examState.clear();
      }
    });
  }
}
