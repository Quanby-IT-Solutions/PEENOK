import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AReleaseDocumentProceedComponent } from './release-document-proceed.component';

describe('ReleaseDocumentProceedComponent', () => {
  let component: AReleaseDocumentProceedComponent;
  let fixture: ComponentFixture<AReleaseDocumentProceedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AReleaseDocumentProceedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AReleaseDocumentProceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
