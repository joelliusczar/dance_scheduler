import { TestBed } from '@angular/core/testing';

import { OpQueueService } from './op-queue.service';

describe('OpQueueService', () => {
	let service: OpQueueService;
	let drop: string;
	let timeoutIds = [];

	const getNeverResolvingPromise = (name: string) => {
		return () => {
			const promise = new Promise<void>(() => {
				console.log(`neverResolvingPromise: ${name}`);
				drop = `neverResolvingPromise: ${name}`;
			});
			return promise;
		}
	};

	const awaitable = (name: string, length: number) => {
		const promise = new Promise((resolve) => {
			const id = setTimeout(() => {
				drop = name;
				console.log(`in timeout ${name}`);
				resolve();
			}, length);
			timeoutIds.push(id);
		});
		return promise;
	};

	const runSeries = async (name: string) => {
		console.log(`runSeries: ${name}`);
		const length = 100;
		await awaitable(`${name} 1`, length);
		await awaitable(`${name} 2`, length);
		await awaitable(`${name} 3`, length);
	};

  beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(OpQueueService);
		drop = undefined;
		timeoutIds = [];
		jasmine.clock().install();
	});
	
	afterEach(() => {
		jasmine.clock().uninstall();
	});

  it('should be created', () => {
    expect(service).toBeTruthy();
	});
	
	it('should run a simple method', async () => {
		service.enqueueOp(getNeverResolvingPromise(''));
		expect(drop).toEqual('neverResolvingPromise: ');
	});

	it('does the away get stuck?', async () => {
		const callback = jasmine.createSpy('callback');
		setTimeout(async () => {
			await service.enqueueOp(getNeverResolvingPromise('Alpha'));
			callback();
		}, 3000);
		jasmine.clock().tick(3100);
		expect(callback).toHaveBeenCalledTimes(0);
		// service.enqueueOp(getNeverResolvingPromise('Bravo'));
		expect(drop).toEqual('neverResolvingPromise: Alpha');
		console.log('done waiting');
	});

	it('run series', (done: DoneFn) => {
		runSeries('alpha');
		runSeries('bravo');
		runSeries('charley');
		expect(drop).toEqual(undefined);
		jasmine.clock().tick(101);
		expect(drop).toEqual('charley 1');
		
		Promise.resolve(1).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('charley 2');
			Promise.resolve(1).then(() => {
				jasmine.clock().tick(101);
				expect(drop).toEqual('charley 3');
				done();
			});
		});
	});

	it('enqueue single call', (done: DoneFn) => {
		service.enqueueOp(() => {
			return runSeries('pizza');
		});
		expect(drop).toEqual(undefined);
		jasmine.clock().tick(101);
		expect(drop).toEqual('pizza 1');
		Promise.resolve(1).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('pizza 2');
			Promise.resolve(1).then(() => {
				jasmine.clock().tick(101);
				expect(drop).toEqual('pizza 3');
				done();
			});
		});
	});

	it('enqueue multiple call', (done: DoneFn) => {
		console.log('enqueue multiple call');
		service.enqueueOp(() => {
			return runSeries('shark');
		});
		service.enqueueOp(() => {
			return runSeries('dolphin');
		});
		service.enqueueOp(() => {
			return runSeries('whale');
		});
		service.enqueueOp(() => {
			return runSeries('squid');
		});
		expect(drop).toEqual(undefined);
		jasmine.clock().tick(101);
		expect(drop).toEqual('shark 1');
		//this chain of thens is necessary to advance the event loop queue
		Promise.resolve(1).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('shark 2');
		}).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('shark 3');
		}).then().then().then(()=> {
			jasmine.clock().tick(101);
			expect(drop).toEqual('dolphin 1');
		}).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('dolphin 2');
		}).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('dolphin 3');
		}).then().then().then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('whale 1');
		}).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('whale 2');
		}).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('whale 3');
		}).then().then().then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('squid 1');
		}).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('squid 2');
		}).then(() => {
			jasmine.clock().tick(101);
			expect(drop).toEqual('squid 3');
			done();
		});
	});

});


 