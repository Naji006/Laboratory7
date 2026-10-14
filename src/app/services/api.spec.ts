import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService, Student, apiError, safeUrl } from './api';

const base = 'https://ipt02-student-directory.netlify.app/api';
const student: Student = {
  student_id: 'test/001',
  student_name: 'Test Student',
  section: 'BSIT-3Z',
  email: 'test@example.com',
  mobile_number: '',
  social_media_link: '',
  profile_picture_url: '',
};
describe('ApiService endpoint contracts', () => {
  let api: ApiService;
  let http: HttpTestingController;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
    localStorage.clear();
  });
  function login() {
    api
      .login({ student_id: student.student_id, password: 'synthetic-password' })
      .subscribe();
    const req = http.expectOne(`${base}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      student_id: student.student_id,
      password: 'synthetic-password',
    });
    req.flush({ token: 'synthetic-test-token', student });
  }
  it('posts the documented registration payload without persisting credentials', () => {
    const data = {
      ...student,
      password: 'synthetic-password',
      registration_token: 'synthetic-class-token',
    };
    api.register(data).subscribe();
    const req = http.expectOne(`${base}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({ message: 'Registered' });
    expect(localStorage.length).toBe(0);
  });
  it('saves login token and student, and attaches Bearer token to directory requests', () => {
    login();
    expect(api.authenticated).toBe(true);
    expect(api.student()).toEqual(student);
    api.getStudents().subscribe((data) => expect(data).toEqual([student]));
    const req = http.expectOne(`${base}/students`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer synthetic-test-token',
    );
    req.flush([student]);
  });
  it('updates only the logged-in student with an encoded student ID and retains the ID', () => {
    login();
    const profile = {
      student_name: 'Updated Name',
      section: 'BSIT-3A',
      email: 'updated@example.com',
      mobile_number: '',
      social_media_link: '',
      profile_picture_url: '',
    };
    api.updateProfile(profile).subscribe();
    const req = http.expectOne(`${base}/students/test%2F001`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer synthetic-test-token',
    );
    expect(req.request.body).toEqual(profile);
    req.flush({ message: 'Updated' });
    expect(api.student()).toEqual({
      ...profile,
      student_id: student.student_id,
    });
  });
  it('keeps the saved profile unchanged when an update fails and clears session on logout', () => {
    login();
    api
      .updateProfile({ ...student, student_name: 'Unsaved' })
      .subscribe({
        error: (error) => expect(apiError(error)).toBe('Forbidden'),
      });
    http
      .expectOne(`${base}/students/test%2F001`)
      .flush(
        { message: 'Forbidden' },
        { status: 403, statusText: 'Forbidden' },
      );
    expect(api.student()).toEqual(student);
    api.logout();
    expect(api.authenticated).toBe(false);
    expect(api.student()).toBeNull();
    expect(localStorage.length).toBe(0);
  });
  it('rejects incomplete login responses without creating a session', () => {
    let message = '';
    api
      .login({ student_id: 'test', password: 'synthetic' })
      .subscribe({ error: (error) => (message = apiError(error)) });
    http.expectOne(`${base}/login`).flush({ token: 'synthetic-test-token' });
    expect(message).toContain('incomplete');
    expect(api.authenticated).toBe(false);
  });
  it('only permits HTTP and HTTPS URLs for remote profiles and images', () => {
    expect(safeUrl('javascript:alert(1)')).toBeNull();
    expect(safeUrl('data:text/html,test')).toBeNull();
    expect(safeUrl('https://example.com/profile')).toBe(
      'https://example.com/profile',
    );
  });
});
