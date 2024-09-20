import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UReleaseDocumentProceedComponent } from './release-document-proceed.component';

describe('UReleaseDocumentProceedComponent', () => {
  let component: UReleaseDocumentProceedComponent;
  let fixture: ComponentFixture<UReleaseDocumentProceedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UReleaseDocumentProceedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UReleaseDocumentProceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
