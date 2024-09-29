import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LoaderService
{
	private _loading      : number = 0;

	private _loader       : BehaviorSubject<number>;

	constructor()
	{
		this._loader = new BehaviorSubject(1);
	}

	get loaded$() : Observable<number>
	{
		return this._loader.asObservable();
	}

	loading()
	{
		this._loading++;
		this._loader.next(this._loading);
	}

	completed()
	{
		setTimeout(() => {
			this._loading--;
			this._loader.next(this._loading);
		},5);
	}
}
