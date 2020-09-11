import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DancerListComponent } from './dancer-list/dancer-list.component';

const routes: Routes = [
	{ path: 'dancerList', component: DancerListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}

