import { TableColumn } from '@shared/table/table.types';
import { Student } from '@core/models/student';

export const STUDENT_COLUMNS: TableColumn<Student>[] = [
  { key: 'number', label: 'Nömrə', sortable: true },
  { key: 'firstName', label: 'Ad', sortable: true },
  { key: 'lastName', label: 'Soyad', sortable: true },
  { key: 'grade', label: 'Sinif', sortable: true },
];
