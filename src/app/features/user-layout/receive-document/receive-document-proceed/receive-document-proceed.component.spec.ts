import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UReceiveDocumentProceedComponent } from './receive-document-proceed.component';

describe('UReceiveDocumentProceedComponent', () => {
  let component: UReceiveDocumentProceedComponent;
  let fixture: ComponentFixture<UReceiveDocumentProceedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UReceiveDocumentProceedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UReceiveDocumentProceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
