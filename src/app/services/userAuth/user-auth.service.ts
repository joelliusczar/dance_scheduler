import { Injectable } from '@angular/core';
import { DanceSchedulerRoute, ModeAccess, RoleAccess } from 'src/app/routeDefintions';
import { RoleType } from 'src/app/types/roles';
import { User } from 'src/app/types/user';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

	user: User;

	constructor() { }
	
	public canViewRoute(routeDef: DanceSchedulerRoute): boolean {
		const roleAll = routeDef.roleFilter === RoleAccess.All
		if(roleAll) {
			return true;
		}
		if(this.user.roles.some(r => r.name === RoleType.Admin )) 
		{
			return true;
		}

		//#TODO: change to false
		return true;
	}
}
