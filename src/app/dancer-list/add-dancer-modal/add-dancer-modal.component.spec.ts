import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDancerModalComponent } from './add-dancer-modal.component';

describe('AddDancerModalComponent', () => {
  let component: AddDancerModalComponent;
  let fixture: ComponentFixture<AddDancerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDancerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDancerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
