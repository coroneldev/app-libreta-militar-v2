import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoloDatosPage } from './solo-datos.page';

describe('SoloDatosPage', () => {
  let component: SoloDatosPage;
  let fixture: ComponentFixture<SoloDatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SoloDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
