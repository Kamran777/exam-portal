import { TableColumn } from '@shared/table/table.types';
import { Lesson } from '@core/models/lesson';

export const LESSON_COLUMNS: TableColumn<Lesson>[] = [
  { key: 'code', label: 'Kod', sortable: true },
  { key: 'name', label: 'Ad', sortable: true },
  { key: 'grade', label: 'Sinif', sortable: true },
  {
    key: 'teacherFirstName',
    label: 'Müəllim',
    sortable: false,
    cell: (r: Lesson) => `${r.teacherFirstName} ${r.teacherLastName}`,
  },
] as const;
