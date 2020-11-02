import { Pipe, PipeTransform } from '@angular/core';
import { UserAuthService } from 'src/app/services/userAuth/user-auth.service';
import { DanceSchedulerRoute } from '../../routeDefintions';

@Pipe({
	name: 'routeFilter',
	pure: false,
})
export class RouteFilterPipe implements PipeTransform {

	constructor(private userService: UserAuthService) {}

  transform(value: DanceSchedulerRoute[]): unknown {
		return value.filter(r => {
			return this.userService.canViewRoute(r);
		});
  }

}
