export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  cell?: (row: T) => string | number;
}

export interface TableState {
  page: number;
  pageSize: number;
  sortField: string | null;
  sortDir: 'asc' | 'desc' | null;
  filter: string;
}
