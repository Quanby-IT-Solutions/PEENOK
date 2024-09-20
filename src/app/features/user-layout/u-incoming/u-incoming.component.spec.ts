import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIncomingComponent } from './u-incoming.component';

describe('UIncomingComponent', () => {
  let component: UIncomingComponent;
  let fixture: ComponentFixture<UIncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIncomingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
