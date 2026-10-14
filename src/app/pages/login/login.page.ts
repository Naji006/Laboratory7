import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService, apiError } from '../../services/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [IonContent, FormsModule, RouterLink],
})
export class LoginPage {
  private readonly changeDetector = inject(ChangeDetectorRef);
  api = inject(ApiService);
  router = inject(Router);
  studentId = '';
  password = '';
  showPassword = false;
  loading = false;
  message = '';
  ionViewWillEnter() {
    if (this.api.authenticated) this.router.navigateByUrl('/student-directory');
  }
  login() {
    if (this.loading) return;
    this.loading = true;
    this.message = '';
    this.api
      .login({ student_id: this.studentId.trim(), password: this.password })
      .subscribe({
        next: () => {
          this.loading = false;
          this.changeDetector.markForCheck();
          this.password = '';
          this.router.navigateByUrl('/student-directory');
        },
        error: (error) => {
          this.loading = false;
          this.changeDetector.markForCheck();
          this.message = apiError(error);
        },
      });
  }
}
