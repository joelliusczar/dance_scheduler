import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupleListComponent } from './couple-list.component';

describe('CoupleListComponent', () => {
  let component: CoupleListComponent;
  let fixture: ComponentFixture<CoupleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoupleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoupleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
