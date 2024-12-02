import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthergoalComponent } from './othergoal.component';

describe('OthergoalComponent', () => {
  let component: OthergoalComponent;
  let fixture: ComponentFixture<OthergoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OthergoalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OthergoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
