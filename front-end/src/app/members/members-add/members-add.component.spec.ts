import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersAddComponent } from './members-add.component';

describe('MembersAddComponent', () => {
  let component: MembersAddComponent;
  let fixture: ComponentFixture<MembersAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
