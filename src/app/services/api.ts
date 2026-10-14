import { Injectable, inject, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { tap, timeout } from 'rxjs';

export interface Student {
  student_id: string;
  student_name: string;
  section: string;
  email: string;
  mobile_number: string;
  social_media_link: string;
  profile_picture_url: string;
}
export type Profile = Omit<Student, 'student_id'>;
export interface Registration extends Student {
  password: string;
  registration_token: string;
}
export interface ApiResponse {
  message?: string;
}
export interface LoginResponse extends ApiResponse {
  token: string;
  student: Student;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'https://ipt02-student-directory.netlify.app/api';
  readonly student = signal<Student | null>(this.readStudent());
  private readonly http = inject(HttpClient);
  private readStudent(): Student | null {
    try {
      return JSON.parse(localStorage.getItem('student_user') || 'null');
    } catch {
      return null;
    }
  }
  get authenticated(): boolean {
    return !!localStorage.getItem('auth_token') && !!this.student()?.student_id;
  }
  private get headers() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
    });
  }
  register(data: Registration) {
    return this.http
      .post<ApiResponse>(`${this.baseUrl}/register`, data)
      .pipe(timeout(20000));
  }
  login(data: { student_id: string; password: string }) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data).pipe(
      timeout(20000),
      tap((res) => {
        if (!res.token || !res.student?.student_id)
          throw new Error(
            'The server returned an incomplete login response. Please try again.',
          );
        localStorage.setItem('auth_token', res.token);
        this.saveStudent(res.student);
      }),
    );
  }
  getStudents() {
    return this.http
      .get<Student[]>(`${this.baseUrl}/students`, { headers: this.headers })
      .pipe(timeout(20000));
  }
  updateProfile(data: Profile) {
    const id = this.student()?.student_id || '';
    return this.http
      .put<ApiResponse>(
        `${this.baseUrl}/students/${encodeURIComponent(id)}`,
        data,
        { headers: this.headers },
      )
      .pipe(
        timeout(20000),
        tap(() => {
          this.saveStudent({ ...data, student_id: id });
        }),
      );
  }
  saveStudent(student: Student) {
    localStorage.setItem('student_user', JSON.stringify(student));
    this.student.set(student);
  }
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('student_user');
    this.student.set(null);
  }
}
export function apiError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error;
    return (
      body?.message ||
      body?.error?.message ||
      (typeof body?.error === 'string' ? body.error : '') ||
      (error.status === 0
        ? 'Unable to connect. Check your internet connection and try again.'
        : `Request failed (${error.status}). Please try again.`)
    );
  }
  return error instanceof Error
    ? error.name === 'TimeoutError'
      ? 'The server took too long to respond. Please try again.'
      : error.message
    : 'Something went wrong. Please try again.';
}
export function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
