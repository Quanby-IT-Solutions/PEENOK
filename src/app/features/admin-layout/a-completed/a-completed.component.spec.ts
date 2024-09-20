import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ACompletedComponent } from './a-completed.component';

describe('ACompletedComponent', () => {
  let component: ACompletedComponent;
  let fixture: ComponentFixture<ACompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ACompletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ACompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
