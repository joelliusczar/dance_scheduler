import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompRulesSetupComponent } from './comp-rules-setup.component';

describe('CompRulesSetupComponent', () => {
  let component: CompRulesSetupComponent;
  let fixture: ComponentFixture<CompRulesSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompRulesSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompRulesSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
