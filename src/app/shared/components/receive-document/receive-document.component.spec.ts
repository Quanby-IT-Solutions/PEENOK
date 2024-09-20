import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveDocumentComponent } from './receive-document.component';

describe('ReceiveDocumentComponent', () => {
  let component: ReceiveDocumentComponent;
  let fixture: ComponentFixture<ReceiveDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceiveDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
