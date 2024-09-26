import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateroryStepComponent } from './category-step.component';

describe('CateroryStepComponent', () => {
  let component: CateroryStepComponent;
  let fixture: ComponentFixture<CateroryStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CateroryStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CateroryStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
