import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADocumentsComponent } from './a-documents.component';

describe('ADocumentsComponent', () => {
  let component: ADocumentsComponent;
  let fixture: ComponentFixture<ADocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ADocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ADocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
