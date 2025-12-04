import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  save<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  delete<T extends { id: number | string }>(key: string, id: number | string): void {
    const items = this.get<T>(key).filter((item) => item.id !== id);
    this.save(key, items);
  }

  clear(key: string): void {
    localStorage.removeItem(key);
  }
}
