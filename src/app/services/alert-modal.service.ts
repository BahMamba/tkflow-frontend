import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface AlertModal {
  message: string;
  type: 'success' | 'error' | 'confirm';
  onConfirm?: () => void;
}

@Injectable({ providedIn: 'root' })
export class AlertModalService {
  private readonly alertSubject = new Subject<AlertModal | null>();
  readonly alert$: Observable<AlertModal | null> = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'error', autoCloseMs = 4000): void {
    this.alertSubject.next({ message, type });
    if (autoCloseMs > 0) setTimeout(() => this.close(), autoCloseMs);
  }

  showConfirm(message: string, onConfirm: () => void): void {
    this.alertSubject.next({ message, type: 'confirm', onConfirm });
  }

  close(): void {
    this.alertSubject.next(null);
  }
}