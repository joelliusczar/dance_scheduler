import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DancerListComponent } from './dancer-list/dancer-list.component';
import { CoupleListComponent } from './couple-list/couple-list.component';
import { SchoolListComponent } from './school-list/school-list.component';
import { CompRulesSetupComponent } from './comp-rules-setup/comp-rules-setup.component';

const routes: Routes = [
	{ path: 'dancers', component: DancerListComponent },
	{ path: 'couples', component: CoupleListComponent },
	{ path: 'schools', component: SchoolListComponent },
	{ path: 'compRules', component: CompRulesSetupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}

