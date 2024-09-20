import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseDocumentProceedComponent } from './release-document-proceed.component';

describe('ReleaseDocumentProceedComponent', () => {
  let component: ReleaseDocumentProceedComponent;
  let fixture: ComponentFixture<ReleaseDocumentProceedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseDocumentProceedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReleaseDocumentProceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
