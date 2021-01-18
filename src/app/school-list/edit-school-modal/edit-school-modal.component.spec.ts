import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EditSchoolModalComponent } from './edit-school-modal.component';

describe('EditSchoolModalComponent', () => {
  let component: EditSchoolModalComponent;
  let fixture: ComponentFixture<EditSchoolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
			imports: [ MatDialogModule ],
			declarations: [ EditSchoolModalComponent ],
			providers: [ 
				{
					provide: MatDialogRef,
					useFactory: () => ({
					})
				},
				{
					provide: MAT_DIALOG_DATA,
					useFactory: () => ({})
				}
			]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSchoolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
