import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgoalComponent } from './addgoal.component';

describe('AddgoalComponent', () => {
  let component: AddgoalComponent;
  let fixture: ComponentFixture<AddgoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddgoalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddgoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
