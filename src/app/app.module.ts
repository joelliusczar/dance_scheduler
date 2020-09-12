import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DancerListComponent } from './dancer-list/dancer-list.component';
import { MenuComponent } from './menu/menu.component';
import { CoupleListComponent } from './couple-list/couple-list.component';
import { SchoolListComponent } from './school-list/school-list.component';
import { CompRulesSetupComponent } from './comp-rules-setup/comp-rules-setup.component';

@NgModule({
  declarations: [
    AppComponent,
    DancerListComponent,
    MenuComponent,
    CoupleListComponent,
    SchoolListComponent,
    CompRulesSetupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
