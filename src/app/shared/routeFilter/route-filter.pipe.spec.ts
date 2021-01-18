import { RouteFilterPipe } from './route-filter.pipe';
import { inject, TestBed } from '@angular/core/testing';
import { UserAuthService } from 'src/app/services/userAuth/user-auth.service';

describe('RouteFilterPipe', () => {

	let service: UserAuthService;
	let pipe: RouteFilterPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
			providers: [
				UserAuthService
			]
		});
		service = TestBed.inject(UserAuthService);
		pipe = new RouteFilterPipe(service);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
