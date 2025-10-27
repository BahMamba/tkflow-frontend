import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskStats } from '../../models/task.model';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-stats.component.html',
})
export class TaskStatsComponent implements OnInit {
  stats: TaskStats | null = null;
  loading = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats() {
    this.loading = true;
    this.taskService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}