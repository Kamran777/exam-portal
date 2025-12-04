import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Exam } from '@core/models/exam';
import { Lesson } from '@core/models/lesson';
import { Student } from '@core/models/student';
import { StorageService } from '@core/services/storage.service';
import { ExamsTableComponent } from '../exams-table/exams-table.component';

@Component({
  selector: 'app-exams-shell',
  standalone: true,
  imports: [CommonModule, ExamsTableComponent],
  templateUrl: './exams-shell.component.html',
  styleUrls: ['./exams-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamsShellComponent implements OnInit {
  exams$!: Observable<Exam[]>;
  lessons$!: Observable<Lesson[]>;
  students$!: Observable<Student[]>;

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.loadInitialDataFromStorage();
  }

  private loadInitialDataFromStorage(): void {
    this.exams$ = this.getFromStorage<Exam>('exams');
    this.lessons$ = this.getFromStorage<Lesson>('lessons');
    this.students$ = this.getFromStorage<Student>('students');
  }

  private getFromStorage<T>(key: string): Observable<T[]> {
    const data = this.storage.get<T>(key) || [];
    return of(data);
  }
}
