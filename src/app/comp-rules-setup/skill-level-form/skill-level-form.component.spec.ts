import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SkillLevelFormComponent } from './skill-level-form.component';

describe('SkillLevelFormComponent', () => {
  let component: SkillLevelFormComponent;
  let fixture: ComponentFixture<SkillLevelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
			imports: [ FormsModule ],
      declarations: [ SkillLevelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillLevelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
