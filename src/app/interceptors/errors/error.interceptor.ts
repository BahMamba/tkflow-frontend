import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertModalService } from '../../services/alert-modal.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertModalService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = '';

      // Si le backend renvoie un objet d’erreurs : { "email": ["Cet email est déjà utilisé."] }
      if (error.error && typeof error.error === 'object') {
        const firstKey = Object.keys(error.error)[0];
        const value = error.error[firstKey];
        message = Array.isArray(value) ? value[0] : value;
      }
      // Si le backend renvoie un message direct (ex: { "message": "Erreur ..." })
      else if (error.error?.message) {
        message = error.error.message;
      }
      // Si c’est une erreur texte brute (cas rare)
      else if (typeof error.error === 'string') {
        message = error.error;
      }
      // Fallback générique minimal
      else {
        message = 'Une erreur est survenue.';
      }

      alertService.showAlert(message, 'error');
      return throwError(() => error);
    })
  );
};
