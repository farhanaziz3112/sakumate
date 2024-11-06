import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetprofileComponent } from './budgetprofile.component';

describe('BudgetprofileComponent', () => {
  let component: BudgetprofileComponent;
  let fixture: ComponentFixture<BudgetprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BudgetprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
