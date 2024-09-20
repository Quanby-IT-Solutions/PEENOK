import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UCompletedComponent } from './u-completed.component';

describe('UCompletedComponent', () => {
  let component: UCompletedComponent;
  let fixture: ComponentFixture<UCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UCompletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
