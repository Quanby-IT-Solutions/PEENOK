import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UReleaseDocumentComponent } from './release-document.component';

describe('UReleaseDocumentComponent', () => {
  let component: UReleaseDocumentComponent;
  let fixture: ComponentFixture<UReleaseDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UReleaseDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UReleaseDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
