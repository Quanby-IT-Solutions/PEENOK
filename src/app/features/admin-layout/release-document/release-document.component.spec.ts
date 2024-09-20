import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AReleaseDocumentComponent } from './release-document.component';

describe('AReleaseDocumentComponent', () => {
  let component: AReleaseDocumentComponent;
  let fixture: ComponentFixture<AReleaseDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AReleaseDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AReleaseDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
