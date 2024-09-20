import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveDocumentProceedComponent } from './receive-document-proceed.component';

describe('ReceiveDocumentProceedComponent', () => {
  let component: ReceiveDocumentProceedComponent;
  let fixture: ComponentFixture<ReceiveDocumentProceedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveDocumentProceedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceiveDocumentProceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
