import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalprofileComponent } from './goalprofile.component';

describe('GoalprofileComponent', () => {
  let component: GoalprofileComponent;
  let fixture: ComponentFixture<GoalprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
