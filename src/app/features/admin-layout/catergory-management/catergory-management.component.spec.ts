import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatergoryManagementComponent } from './catergory-management.component';

describe('CatergoryManagementComponent', () => {
  let component: CatergoryManagementComponent;
  let fixture: ComponentFixture<CatergoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatergoryManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatergoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
