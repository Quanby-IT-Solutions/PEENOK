import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UOutgoingComponent } from './u-outgoing.component';

describe('UOutgoingComponent', () => {
  let component: UOutgoingComponent;
  let fixture: ComponentFixture<UOutgoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UOutgoingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UOutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
