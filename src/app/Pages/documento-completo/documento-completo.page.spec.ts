import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentoCompletoPage } from './documento-completo.page';

describe('DocumentoCompletoPage', () => {
  let component: DocumentoCompletoPage;
  let fixture: ComponentFixture<DocumentoCompletoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoCompletoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
