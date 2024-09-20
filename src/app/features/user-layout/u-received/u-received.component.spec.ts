import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UReceivedComponent } from './u-received.component';

describe('UReceivedComponent', () => {
  let component: UReceivedComponent;
  let fixture: ComponentFixture<UReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UReceivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
