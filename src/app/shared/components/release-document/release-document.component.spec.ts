import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseDocumentComponent } from './release-document.component';

describe('ReleaseDocumentComponent', () => {
  let component: ReleaseDocumentComponent;
  let fixture: ComponentFixture<ReleaseDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReleaseDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
