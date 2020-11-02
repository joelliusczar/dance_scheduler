import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DancerListComponent } from './dancer-list/dancer-list.component';
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

@NgModule({
  declarations: [
    AppComponent,
    DancerListComponent,
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
  ],
  imports: [
    BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
