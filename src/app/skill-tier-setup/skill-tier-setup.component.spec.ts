import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillTierSetupComponent } from './skill-tier-setup.component';

describe('SkillTierSetupComponent', () => {
  let component: SkillTierSetupComponent;
  let fixture: ComponentFixture<SkillTierSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillTierSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillTierSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
