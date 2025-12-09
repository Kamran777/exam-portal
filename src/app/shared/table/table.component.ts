import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableState } from './table.types';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() rows$!: Observable<T[]>;

  state: TableState = {
    page: 1,
    pageSize: 4,
    sortField: null,
    sortDir: null,
    filter: '',
  };

  @Output() action = new EventEmitter<{ type: string; row: T }>();

  updateFilter(value: string): void {
    this.state = { ...this.state, filter: value.toLowerCase(), page: 1 };
  }

  changeSort(field: string): void {
    this.state = {
      ...this.state,
      sortField: field,
      sortDir:
        this.state.sortField === field ? (this.state.sortDir === 'asc' ? 'desc' : 'asc') : 'asc',
    };
  }

  goToPage(page: number): void {
    this.state = { ...this.state, page };
  }

  vm$ = (): Observable<{
    rows: T[];
    total: number;
    totalPages: number;
    page: number;
  }> =>
    this.rows$.pipe(
      map((rows) => {
        let data = [...rows];

        if (this.state.filter) {
          data = data.filter((row) =>
            JSON.stringify(row).toLowerCase().includes(this.state.filter)
          );
        }

        if (this.state.sortField) {
          data.sort((a: any, b: any) => {
            const fa = a[this.state.sortField!];
            const fb = b[this.state.sortField!];
            return this.state.sortDir === 'asc' ? (fa > fb ? 1 : -1) : fa < fb ? 1 : -1;
          });
        }

        const total = data.length;
        const totalPages = Math.ceil(total / this.state.pageSize);
        const paginated = data.slice(
          (this.state.page - 1) * this.state.pageSize,
          this.state.page * this.state.pageSize
        );

        return {
          rows: paginated,
          total,
          totalPages,
          page: this.state.page,
        };
      })
    );
}
