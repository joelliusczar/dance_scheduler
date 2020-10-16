import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanceFormComponent } from './dance-form.component';

describe('DanceFormComponent', () => {
  let component: DanceFormComponent;
  let fixture: ComponentFixture<DanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
