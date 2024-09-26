import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllImagesDialogComponent } from './view-all-images-dialog.component';

describe('ViewAllImagesDialogComponent', () => {
  let component: ViewAllImagesDialogComponent;
  let fixture: ComponentFixture<ViewAllImagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllImagesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllImagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
