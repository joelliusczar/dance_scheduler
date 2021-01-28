import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDanceFormComponent } from './multi-dance-form.component';

describe('MultiDanceFormComponent', () => {
  let component: MultiDanceFormComponent;
  let fixture: ComponentFixture<MultiDanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDanceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
