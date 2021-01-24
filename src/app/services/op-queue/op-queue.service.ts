import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class OpQueueService {
	private _promiseTail: Promise<unknown>;
	constructor() { }
	
	enqueueOp(op: () => Promise<unknown>): Promise<unknown> {
		const promiseTail = new Promise<unknown>((resolve) => {
			if(!this._promiseTail) {
				op().then(() => {
					if(promiseTail === this._promiseTail) {
						this._promiseTail = null;
					}
					resolve();
				});
			}
			else {
				this._promiseTail.then(() => {
					op().then(() => {
						if(promiseTail === this._promiseTail) {
							this._promiseTail = null;
						}
						resolve();
					});
				});
			}
		});
		this._promiseTail = promiseTail;
		return promiseTail;
	}
}
