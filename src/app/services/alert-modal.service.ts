import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Modal {
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class AlertModalService {
  private readonly alertSubject = new Subject<Modal | null>();
  readonly alert$: Observable<Modal | null> = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'error', autoCloseMs = 4000): void {
    this.alertSubject.next({ message, type });
    if (autoCloseMs > 0) setTimeout(() => this.close(), autoCloseMs);
  }

  close(): void {
    this.alertSubject.next(null);
  }
}
