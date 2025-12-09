import { TableColumn } from '@shared/table/table.types';
import { Exam } from '@core/models/exam';

export const EXAM_COLUMNS: TableColumn<Exam>[] = [
  { key: 'lessonCode', label: 'Dərs', sortable: true },
  { key: 'studentNumber', label: 'Şagird', sortable: true },
  { key: 'score', label: 'Qiymət', sortable: true },
  { key: 'date', label: 'Tarix', sortable: true },
] as const;
