import { Component, OnInit } from '@angular/core';
import { Task, PaginatedResponse } from '../../models/task.model';
import { AlertModalService } from '../../services/alert-modal.service';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  page = 1;
  pageSize = 10;
  total = 0;
  search = '';
  statusFilter = '';
  priorityFilter = '';
  loading = false;

  constructor(
    private taskService: TaskService,
    private alertService: AlertModalService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService
      .getTasks(this.page, this.pageSize, this.search, this.statusFilter, this.priorityFilter)
      .subscribe({
        next: (res: PaginatedResponse<Task>) => {
          this.tasks = res.results;
          this.total = res.count;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.alertService.showAlert('Impossible de charger les tâches.', 'error');
        },
      });
  }

  deleteTask(taskId: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.alertService.showAlert('Tâche supprimée avec succès.', 'success');
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        this.total -= 1;
      },
      error: () => this.alertService.showAlert('Erreur lors de la suppression.', 'error'),
    });
  }

  onSearchChange(value: string) {
    this.search = value;
    this.page = 1;
    this.loadTasks();
  }

  onFilterChange() {
    this.page = 1;
    this.loadTasks();
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadTasks();
  }
}
