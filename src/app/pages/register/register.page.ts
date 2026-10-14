import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService, Registration, apiError } from '../../services/api';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  imports: [FormsModule, RouterLink, IonContent],
})
export class RegisterPage {
  private readonly changeDetector = inject(ChangeDetectorRef);
  api = inject(ApiService);
  data: Registration = {
    student_id: '',
    student_name: '',
    registration_token: '',
    password: '',
    section: '',
    email: '',
    mobile_number: '',
    social_media_link: '',
    profile_picture_url: '',
  };
  loading = false;
  message = '';
  success = false;
  register() {
    if (this.loading) return;
    this.loading = true;
    this.message = '';
    this.success = false;
    const body = { ...this.data };
    for (const key of Object.keys(body) as (keyof Registration)[])
      if (key !== 'password') body[key] = body[key].trim();
    this.api.register(body).subscribe({
      next: (res) => {
        this.loading = false;
        this.changeDetector.markForCheck();
        this.success = true;
        this.message =
          res.message || 'Account created successfully. You can now log in.';
        this.data.password = '';
        this.data.registration_token = '';
      },
      error: (error) => {
        this.loading = false;
        this.changeDetector.markForCheck();
        this.message = apiError(error);
      },
    });
  }
}
