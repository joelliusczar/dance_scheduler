import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EditPersonModalComponent } from './edit-person-modal.component';

describe('EditPersonModalComponent', () => {
  let component: EditPersonModalComponent;
  let fixture: ComponentFixture<EditPersonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
			imports: [ MatDialogModule ],
			declarations: [ EditPersonModalComponent ],
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
    fixture = TestBed.createComponent(EditPersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
