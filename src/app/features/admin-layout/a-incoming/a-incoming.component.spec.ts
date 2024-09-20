import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIncomingComponent } from './a-incoming.component';

describe('AIncomingComponent', () => {
  let component: AIncomingComponent;
  let fixture: ComponentFixture<AIncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AIncomingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
