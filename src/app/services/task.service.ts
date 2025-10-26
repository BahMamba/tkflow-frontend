import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, PaginatedResponse, TaskStats } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:8000/api/tasks/';

  constructor(private http: HttpClient) {}

  /** 🔹 Liste paginée + filtres + recherche */
  getTasks(
    page: number = 1,
    pageSize: number = 10,
    search: string = '',
    status?: string,
    priority?: string
  ): Observable<PaginatedResponse<Task>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);

    return this.http.get<PaginatedResponse<Task>>(this.baseUrl, { params });
  }

  /** 🔹 Récupération d'une tâche spécifique (pour édition/détail) */
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}${id}/`);
  }

  /** 🔹 Création d'une tâche */
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  /** 🔹 Mise à jour d'une tâche (PATCH partiel) */
  updateTask(id: number, updates: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}${id}/`, updates);
  }

  /** 🔹 Suppression d'une tâche */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }


  // ✅ Marquer une tâche comme terminée
  markTaskAsDone(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}${id}/`, { status: 'done' });
  }


  /** 🔹 Statistiques globales des tâches */
  getStats(): Observable<TaskStats> {
    return this.http.get<TaskStats>(`${this.baseUrl}stats/`);
  }
}
