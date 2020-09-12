import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { allRoutes } from './routeDefintions';


const routes: Routes = allRoutes;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}

