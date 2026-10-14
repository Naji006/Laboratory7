import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService, Profile, apiError } from '../../services/api';
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  imports: [FormsModule, RouterLink, IonContent],
})
export class UpdateProfilePage {
  private readonly changeDetector = inject(ChangeDetectorRef);
  api = inject(ApiService);
  router = inject(Router);
  data: Profile = {
    student_name: '',
    section: '',
    email: '',
    mobile_number: '',
    social_media_link: '',
    profile_picture_url: '',
  };
  loading = false;
  message = '';
  success = false;
  ionViewWillEnter() {
    const student = this.api.student();
    if (student)
      for (const key of Object.keys(this.data) as (keyof Profile)[])
        this.data[key] = student[key] || '';
    this.message = '';
  }
  update() {
    if (this.loading) return;
    this.loading = true;
    this.message = '';
    this.success = false;
    const body = { ...this.data };
    for (const key of Object.keys(body) as (keyof Profile)[])
      body[key] = body[key].trim();
    this.api.updateProfile(body).subscribe({
      next: (res) => {
        this.loading = false;
        this.changeDetector.markForCheck();
        this.success = true;
        this.message =
          res.message || 'Your profile has been updated successfully.';
      },
      error: (error) => {
        this.loading = false;
        this.changeDetector.markForCheck();
        this.message = apiError(error);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.api.logout();
          this.router.navigateByUrl('/login');
        }
      },
    });
  }
}
