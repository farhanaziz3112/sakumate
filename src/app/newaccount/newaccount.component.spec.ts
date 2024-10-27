import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewaccountComponent } from './newaccount.component';

describe('NewaccountComponent', () => {
  let component: NewaccountComponent;
  let fixture: ComponentFixture<NewaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewaccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
