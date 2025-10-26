import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  taskId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private alertService: AlertModalService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(500)]],
      status: ['todo', Validators.required],
      priority: ['medium', Validators.required],
    });

    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.taskId;

    if (this.isEditMode) {
      this.loadTask();
    }
  }

  loadTask(): void {
    this.taskService.getTask(this.taskId!).subscribe({
      next: (task: Task) => this.taskForm.patchValue(task),
      error: () => {
        this.alertService.showAlert('Impossible de charger la tâche ❌', 'error');
        this.router.navigate(['/tasks']);
      },
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const data = this.taskForm.value;

    const request = this.isEditMode
      ? this.taskService.updateTask(this.taskId!, data)
      : this.taskService.createTask(data);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertService.showAlert(
          this.isEditMode ? 'Tâche mise à jour avec succès ✅' : 'Tâche ajoutée avec succès 🎉',
          'success'
        );
        this.router.navigate(['/tasks']); // ✅ redirection après succès
      },
      error: () => {
        this.isSubmitting = false;
        this.alertService.showAlert('Erreur lors de la sauvegarde ❌', 'error');
      },
    });
  }
}
