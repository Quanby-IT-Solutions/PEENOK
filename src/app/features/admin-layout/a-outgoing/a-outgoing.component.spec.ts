import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AOutgoingComponent } from './a-outgoing.component';

describe('AOutgoingComponent', () => {
  let component: AOutgoingComponent;
  let fixture: ComponentFixture<AOutgoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AOutgoingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AOutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
