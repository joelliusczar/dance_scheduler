import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonListComponent } from './person-list/person-list.component';
import { MenuComponent } from './menu/menu.component';
import { CoupleListComponent } from './couple-list/couple-list.component';
import { CompRulesSetupComponent } 
	from './comp-rules-setup/comp-rules-setup.component';
import { AgeRangeValidatorDirective } 
	from './validators/age-range-validator.directive';
import { AgeGroupFormComponent } 
	from './comp-rules-setup/age-group-form/age-group-form.component';
import { CategoryFormComponent } 
	from './comp-rules-setup/category-form/category-form.component';
import { UpDownComponent } 
	from './shared/components/up-down/up-down.component';
import { ExpandIconComponent, 
	HideIconComponent } 
	from './shared/components/icons/icons.component';
import { DanceFormComponent } 
	from './comp-rules-setup/dance-form/dance-form.component';
import { HomeComponent } from './home/home.component';
import { RouteFilterPipe } from './shared/routeFilter/route-filter.pipe';
import { EditPersonModalComponent } 
	from './person-list/edit-person-modal/edit-person-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SchoolListComponent } from './school-list/school-list.component';
import { EditSchoolModalComponent } 
	from './school-list/edit-school-modal/edit-school-modal.component';
import { SelectComponent } from './shared/components/select/select.component';
import { SelectOptionComponent } 
	from './shared/components/select/select-option/select-option.component';
import { SelectMenuComponent } from './shared/components/select/select-menu/select-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    PersonListComponent,
    MenuComponent,
		CoupleListComponent,
    CompRulesSetupComponent,
    AgeRangeValidatorDirective,
		AgeGroupFormComponent,
		CategoryFormComponent,
		UpDownComponent,
		ExpandIconComponent,
		HideIconComponent,
		DanceFormComponent,
		HomeComponent,
		RouteFilterPipe,
		EditPersonModalComponent,
		SchoolListComponent,
		EditSchoolModalComponent,
		SelectComponent,
		SelectOptionComponent,
		SelectMenuComponent,
  ],
  imports: [
    BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		BrowserAnimationsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatTableModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
