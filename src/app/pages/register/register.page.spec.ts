import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RegisterPage } from './register.page';

describe('RegisterPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
  });
  it('renders asynchronous success feedback without another user interaction', async () => {
    const fixture = TestBed.createComponent(RegisterPage);
    const page = fixture.componentInstance;
    fixture.detectChanges();
    page.data = {
      student_id: ' test-0001 ',
      student_name: ' Test Student ',
      section: 'BSIT-3Z',
      email: 'test@example.com',
      password: 'synthetic-password',
      registration_token: 'synthetic-token',
      mobile_number: '',
      social_media_link: '',
      profile_picture_url: '',
    };
    page.register();
    const http = TestBed.inject(HttpTestingController);
    const req = http.expectOne(
      'https://ipt02-student-directory.netlify.app/api/register',
    );
    expect(req.request.body.student_id).toBe('test-0001');
    req.flush({ message: 'Account registered successfully!' });
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain(
      'Account registered successfully!',
    );
    expect(fixture.nativeElement.textContent).toContain('Continue to login');
    expect(page.loading).toBe(false);
    expect(page.data.password).toBe('');
    expect(page.data.registration_token).toBe('');
    http.verify();
  });
  it('shows API failures and leaves the registration form available to retry', async () => {
    const fixture = TestBed.createComponent(RegisterPage);
    fixture.detectChanges();
    fixture.componentInstance.register();
    const http = TestBed.inject(HttpTestingController);
    http
      .expectOne('https://ipt02-student-directory.netlify.app/api/register')
      .flush(
        { message: 'Invalid registration token' },
        { status: 403, statusText: 'Forbidden' },
      );
    await fixture.whenStable();
    expect(
      fixture.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain('Invalid registration token');
    expect(
      fixture.nativeElement.querySelector('button[type="submit"]').disabled,
    ).toBe(false);
    http.verify();
  });
});
