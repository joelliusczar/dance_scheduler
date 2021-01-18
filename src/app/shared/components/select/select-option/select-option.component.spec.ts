import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { SelectConfig, SELECT_CONFIG } from '../select-config';

import { SelectOptionComponent } from './select-option.component';

describe('SelectOptionComponent', () => {
  let component: SelectOptionComponent;
  let fixture: ComponentFixture<SelectOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
			declarations: [ SelectOptionComponent ],
			providers: [
				{
					provide: SELECT_CONFIG,
					useFactory: () => {
						return new BehaviorSubject<SelectConfig | null>(null);
					}
				}
			]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
