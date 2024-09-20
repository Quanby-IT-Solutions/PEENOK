import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AReceivedComponent } from './a-received.component';

describe('AReceivedComponent', () => {
  let component: AReceivedComponent;
  let fixture: ComponentFixture<AReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AReceivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
