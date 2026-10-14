import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService, Student, apiError, safeUrl } from '../../services/api';
@Component({
  selector: 'app-student-directory',
  templateUrl: './student-directory.page.html',
  imports: [FormsModule, RouterLink, IonContent],
})
export class StudentDirectoryPage {
  private readonly changeDetector = inject(ChangeDetectorRef);
  api = inject(ApiService);
  router = inject(Router);
  students: Student[] = [];
  search = '';
  section = '';
  loading = false;
  message = '';
  failedImages = new Set<string>();
  safeUrl = safeUrl;
  get sections() {
    return [
      ...new Set(this.students.map((s) => s.section).filter(Boolean)),
    ].sort();
  }
  get filtered() {
    const q = this.search.trim().toLowerCase();
    return this.students.filter(
      (s) =>
        (!this.section || s.section === this.section) &&
        [s.student_name, s.student_id, s.section, s.email].some((v) =>
          (v || '').toLowerCase().includes(q),
        ),
    );
  }
  get completion() {
    return this.students.length
      ? Math.round(
          (this.students.filter(
            (s) =>
              !!s.profile_picture_url &&
              !s.profile_picture_url.includes('placeholder'),
          ).length /
            this.students.length) *
            100,
        )
      : 0;
  }
  initials(name: string) {
    return (name || '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }
  ionViewWillEnter() {
    this.load();
  }
  load() {
    if (this.loading) return;
    this.loading = true;
    this.message = '';
    this.api.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
        this.changeDetector.markForCheck();
        this.failedImages.clear();
        const current = students.find(
          (s) => s.student_id === this.api.student()?.student_id,
        );
        if (current) this.api.saveStudent(current);
        this.message = `${students.length} students loaded successfully.`;
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
