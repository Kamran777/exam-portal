import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Inject, DestroyRef } from '@angular/core';
import { NavigationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Exam } from '@core/models/exam';
import { Lesson } from '@core/models/lesson';
import { Student } from '@core/models/student';
import { StateService } from '@core/services/state.service';
import { EXAM_STATE, LESSON_STATE, STUDENT_STATE } from '@core/state/state.token';
import { Brand, BRAND, MENU_ITEMS, MenuItem } from '@shared/constants/app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly brand: Brand = BRAND;
  readonly menuItems: MenuItem[] = MENU_ITEMS;

  constructor(
    private router: Router,
    @Inject(LESSON_STATE) private lessonState: StateService<Lesson>,
    @Inject(STUDENT_STATE) private studentState: StateService<Student>,
    @Inject(EXAM_STATE) private examState: StateService<Exam>,
    private destroyRef: DestroyRef
  ) {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.lessonState.clear();
        this.studentState.clear();
        this.examState.clear();
      }
    });
  }
}
