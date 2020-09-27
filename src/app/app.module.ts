import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DancerListComponent } from './dancer-list/dancer-list.component';
import { MenuComponent } from './menu/menu.component';
import { CoupleListComponent } from './couple-list/couple-list.component';
import { CompRulesSetupComponent } from './comp-rules-setup/comp-rules-setup.component';
import { AgeRangeValidatorDirective } from './age-range-validator.directive';
import { AgeGroupFormComponent } from './comp-rules-setup/age-group-form/age-group-form.component';

@NgModule({
  declarations: [
    AppComponent,
    DancerListComponent,
    MenuComponent,
		CoupleListComponent,
    CompRulesSetupComponent,
    AgeRangeValidatorDirective,
		AgeGroupFormComponent,
  ],
  imports: [
    BrowserModule,
		AppRoutingModule,
		FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
