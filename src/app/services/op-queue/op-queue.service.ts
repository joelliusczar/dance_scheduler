import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class OpQueueService {
	private _promiseTail: Promise<void>;
	constructor() { }
	
	private _setNewTail(promise: Promise<void>): Promise<void> {
		const promiseTail = new Promise<void>((resolve) => {
			promise.then(() => {
				if(promiseTail === this._promiseTail) {
					this._promiseTail = null;
				}
				resolve();
			});
		});
		this._promiseTail = promiseTail;
		return promiseTail;
	}

	enqueueOp(op: () => Promise<void>): Promise<void> {
		if(this._promiseTail) {
			const then = this._promiseTail.then(() => {
				const opPromise = op();
				this._setNewTail(opPromise);
			});
			return then;
		}
		else {
			const opPromise = op();
			return this._setNewTail(opPromise);
		}
	}
}
