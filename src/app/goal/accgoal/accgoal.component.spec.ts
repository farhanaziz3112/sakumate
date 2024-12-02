import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccgoalComponent } from './accgoal.component';

describe('AccgoalComponent', () => {
  let component: AccgoalComponent;
  let fixture: ComponentFixture<AccgoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccgoalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccgoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
