import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AReceiveDocumentProceedComponent } from './receive-document-proceed.component';

describe('ReceiveDocumentProceedComponent', () => {
  let component: AReceiveDocumentProceedComponent;
  let fixture: ComponentFixture<AReceiveDocumentProceedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AReceiveDocumentProceedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AReceiveDocumentProceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
