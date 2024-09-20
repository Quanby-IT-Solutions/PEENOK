import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UElogsComponent } from './u-elogs.component';

describe('UElogsComponent', () => {
  let component: UElogsComponent;
  let fixture: ComponentFixture<UElogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UElogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UElogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
