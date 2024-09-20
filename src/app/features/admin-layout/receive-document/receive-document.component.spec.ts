import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AReceiveDocumentComponent } from './receive-document.component';

describe('AReceiveDocumentComponent', () => {
  let component: AReceiveDocumentComponent;
  let fixture: ComponentFixture<AReceiveDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AReceiveDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AReceiveDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
