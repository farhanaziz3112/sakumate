import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountprofileComponent } from './accountprofile.component';

describe('AccountprofileComponent', () => {
  let component: AccountprofileComponent;
  let fixture: ComponentFixture<AccountprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
