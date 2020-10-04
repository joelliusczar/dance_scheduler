import { Route } from '@angular/router';
import { DancerListComponent } from './dancer-list/dancer-list.component';
import { CoupleListComponent } from './couple-list/couple-list.component';
import { CompRulesSetupComponent } from './comp-rules-setup/comp-rules-setup.component';

export enum RouteAccess {
	CompetitionSetup,
};

export interface DisplayRoute {
	display: string,
	filter: RouteAccess,
};

export interface DanceSchedulerRoute extends Route, DisplayRoute { };

export const allRoutes: Array<DanceSchedulerRoute> = [
	{ 
		path: 'dancers', 
		component: DancerListComponent, 
		display: 'Dancers', 
		filter: RouteAccess.CompetitionSetup 
	},
	{ 
		path: 'couples', 
		component: CoupleListComponent, 
		display: 'Couples', 
		filter: RouteAccess.CompetitionSetup 
	},
	{ 
		path: 'compVars', 
		component: CompRulesSetupComponent, 
		display: 'Variations', 
		filter: RouteAccess.CompetitionSetup 
	},
];