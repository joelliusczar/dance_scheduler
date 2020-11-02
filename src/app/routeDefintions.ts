import { Route } from '@angular/router';
import { DancerListComponent } from './dancer-list/dancer-list.component';
import { CoupleListComponent } from './couple-list/couple-list.component';
import { CompRulesSetupComponent } 
	from './comp-rules-setup/comp-rules-setup.component';
import { HomeComponent } from './home/home.component';

export enum ModeAccess {
	All,
	CompetitionSetup,
};

export enum RoleAccess {
	All,
	AdminOnly,
	Judge
}

export interface DisplayRoute {
	display: string,
	modeFilter: ModeAccess,
	roleFilter: RoleAccess,
};

export interface DanceSchedulerRoute extends Route, DisplayRoute { };

export const allRoutes: DanceSchedulerRoute[] = [
	{
		path: '',
		component: HomeComponent,
		display: 'Home',
		modeFilter: ModeAccess.All,
		roleFilter: RoleAccess.All
	},
	{ 
		path: 'dancers', 
		component: DancerListComponent, 
		display: 'Dancers', 
		modeFilter: ModeAccess.CompetitionSetup,
		roleFilter: RoleAccess.AdminOnly 
	},
	{ 
		path: 'couples', 
		component: CoupleListComponent, 
		display: 'Couples', 
		modeFilter: ModeAccess.CompetitionSetup,
		roleFilter: RoleAccess.AdminOnly 
	},
	{ 
		path: 'compVars', 
		component: CompRulesSetupComponent, 
		display: 'Variations', 
		modeFilter: ModeAccess.CompetitionSetup,
		roleFilter: RoleAccess.AdminOnly 
	},
];