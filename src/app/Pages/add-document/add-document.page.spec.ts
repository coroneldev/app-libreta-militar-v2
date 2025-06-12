import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDocumentPage } from './add-document.page';

describe('AddDocumentPage', () => {
  let component: AddDocumentPage;
  let fixture: ComponentFixture<AddDocumentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
