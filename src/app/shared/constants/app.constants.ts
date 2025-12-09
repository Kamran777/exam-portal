export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

export interface Brand {
  initials: string;
  name: string;
  footer: string;
}

export const BRAND: Brand = {
  initials: 'K',
  name: 'SHUKURZADE',
  footer: 'Made by Kamran Shukurzade',
};

export const MENU_ITEMS: MenuItem[] = [
  { label: 'İmtahanlar', icon: 'fa fa-edit', route: '/exams' },
  { label: 'Dərslər', icon: 'fa fa-book-open', route: '/lessons' },
  { label: 'Şagirdlər', icon: 'fa fa-user-graduate', route: '/students' },
  { label: 'Qeydiyyat', icon: 'fa fa-sign', route: '/register' },
];
