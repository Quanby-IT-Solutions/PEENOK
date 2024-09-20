import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UDocumentsComponent } from './u-documents.component';

describe('UDocumentsComponent', () => {
  let component: UDocumentsComponent;
  let fixture: ComponentFixture<UDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
