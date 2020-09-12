import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DancerListComponent } from './dancer-list/dancer-list.component';
import { CoupleListComponent } from './couple-list/couple-list.component';
import { SchoolListComponent } from './school-list/school-list.component';
import { SkillTierSetupComponent } from './skill-tier-setup/skill-tier-setup.component';

const routes: Routes = [
	{ path: 'dancers', component: DancerListComponent },
	{ path: 'couples', component: CoupleListComponent },
	{ path: 'schools', component: SchoolListComponent },
	{ path: 'skillTiers', component: SkillTierSetupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}

