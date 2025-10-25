import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertModalService } from '../../services/alert-modal.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnDestroy {
  alert: { message: string; type: 'success' | 'error' } | null = null;
  private subscription: Subscription;

  constructor(private alertService: AlertModalService) {
    this.subscription = this.alertService.alert$.subscribe((alert) => (this.alert = alert));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.alertService.close();
  }
}