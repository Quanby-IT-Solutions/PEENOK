import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UProfileComponent } from './u-profile.component';

describe('UProfileComponent', () => {
  let component: UProfileComponent;
  let fixture: ComponentFixture<UProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});