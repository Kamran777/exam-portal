import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService<T extends { id: number | string }> {
  private subject = new BehaviorSubject<T[]>([]);
  readonly data$ = this.subject.asObservable();

  get value(): T[] {
    return this.subject.value;
  }

  set(items: T[]): void {
    this.subject.next(items);
  }

  add(item: T): void {
    this.subject.next([...this.subject.value, item]);
  }

  update(id: number | string, partial: Partial<T>): void {
    this.subject.next(this.subject.value.map((e) => (e.id === id ? { ...e, ...partial } : e)));
  }

  delete(id: number | string): void {
    this.subject.next(this.subject.value.filter((e) => e.id !== id));
  }

  clear(): void {
    this.subject.next([]);
  }
}
