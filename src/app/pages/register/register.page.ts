
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonItem, IonInput, IonButton, IonText, IonSelect,
  IonSelectOption, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonLabel, IonBackButton, IonButtons
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader,
    IonToolbar, IonTitle, IonItem, IonInput, IonButton,
    IonText, IonSelect, IonSelectOption, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent,
    IonLabel, IonBackButton, IonButtons
  ]
})
export class RegisterPage {
  registrationToken = '';
  studentId = '';
  studentName = '';
  password = '';
  section = 'BSIT-3Z';
  email = '';
  mobileNumber = '';
  socialLink = '';
  profilePictureUrl = '';

  message = '';
  isLoading = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  register() {
    this.message = '';

    if (
      !this.registrationToken.trim() ||
      !this.studentId.trim() ||
      !this.studentName.trim() ||
      !this.password ||
      !this.email.trim()
    ) {
      this.message = 'Please complete all required fields.';
      return;
    }

    const body = {
      registration_token: this.registrationToken.trim(),
      student_id: this.studentId.trim(),
      student_name: this.studentName.trim(),
      password: this.password,
      section: this.section,
      email: this.email.trim(),
      mobile_number: this.mobileNumber.trim(),
      social_media_link: this.socialLink.trim(),
      profile_picture_url: this.profilePictureUrl.trim()
    };

    this.isLoading = true;

    this.api.register(body).subscribe({
      next: () => {
        this.isLoading = false;
        this.message = 'Registration successful! You can now log in.';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.message =
          err.error?.error?.message ||
          err.error?.message ||
          'Registration failed. Check your details and registration token.';
      }
    });
  }
}
