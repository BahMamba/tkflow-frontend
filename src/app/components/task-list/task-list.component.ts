import { Component, OnInit } from '@angular/core';
import { Task, PaginatedResponse } from '../../models/task.model';
import { AlertModalService } from '../../services/alert-modal.service';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-list.component.html',
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

  confirmDelete(taskId: number): void {
    this.alertService.showConfirm('Voulez-vous vraiment supprimer cette tâche ?', () => this.deleteTask(taskId));
  }

  deleteTask(taskId: number): void {
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

  markAsDone(task: Task): void {
    this.taskService.markTaskAsDone(task.id).subscribe({
      next: (updatedTask) => {
        task.status = updatedTask.status;
        this.alertService.showAlert('Tâche marquée comme terminée.', 'success');
      },
      error: () => {
        this.alertService.showAlert('Erreur lors de la mise à jour.', 'error');
      },
    });
  }

  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      todo: 'À faire',
      in_progress: 'En cours',
      done: 'Terminé',
    };
    return statusMap[status] || status;
  }

  translatePriority(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
    };
    return priorityMap[priority] || priority;
  }
}