import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AReportsComponent } from './a-reports.component';

describe('AReportsComponent', () => {
  let component: AReportsComponent;
  let fixture: ComponentFixture<AReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
