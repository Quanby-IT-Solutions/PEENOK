import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UReceiveDocumentComponent } from './receive-document.component';

describe('UReceiveDocumentComponent', () => {
  let component: UReceiveDocumentComponent;
  let fixture: ComponentFixture<UReceiveDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UReceiveDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UReceiveDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
