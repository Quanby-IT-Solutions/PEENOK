import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ALogsComponent } from './a-logs.component';

describe('ALogsComponent', () => {
  let component: ALogsComponent;
  let fixture: ComponentFixture<ALogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ALogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ALogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
