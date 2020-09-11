import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DancerListComponent } from './dancer-list.component';

describe('DancerListComponent', () => {
  let component: DancerListComponent;
  let fixture: ComponentFixture<DancerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DancerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DancerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
