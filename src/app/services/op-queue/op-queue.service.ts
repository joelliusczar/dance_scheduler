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
				op().then((result) => {
					if(promiseTail === this._promiseTail) {
						this._promiseTail = null;
					}
					resolve(result);
				});
			}
			else {
				this._promiseTail.then(() => {
					op().then((result) => {
						if(promiseTail === this._promiseTail) {
							this._promiseTail = null;
						}
						resolve(result);
					});
				});
			}
		});
		this._promiseTail = promiseTail;
		return promiseTail;
	}
}
