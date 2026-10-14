import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentDirectoryPage } from './student-directory.page';

describe('StudentDirectoryPage', () => {
  let component: StudentDirectoryPage;
  let fixture: ComponentFixture<StudentDirectoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDirectoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
