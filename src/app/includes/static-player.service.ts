import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { ErrorProcessingService } from '../services/error-processing.service';
import { Episode, Locale, Response } from '../types';

@Injectable({
	providedIn: 'root'
})
export class StaticPlayerService 
{
	private _showPlayer  : BehaviorSubject<boolean>;

	private _episodeData : Episode | null;

	private _episode 	 : BehaviorSubject<Episode | null>;

	constructor(
		private errorProcessing : ErrorProcessingService,
		private apiService		: ApiService, 
	) 
	{
		this._episodeData = null;
		this._episode     = new BehaviorSubject(this._episodeData);
		this._showPlayer  = new BehaviorSubject(false);
	}

	get episode$() : Observable<Episode | null> 
	{
		return this._episode.asObservable();
	}

	set episode(_episode: Episode | null) 
	{
		if (! _episode) {
			this.showMiniPlayer = false;
		}
		this._episodeData = _episode;
		this._episode.next( this._episodeData );
	}

	get showMiniPlayer$() : Observable<boolean> 
	{
		return this._showPlayer.asObservable();
	}

	set showMiniPlayer(val: boolean) 
	{
		this._showPlayer.next( val );
	}

	loadData(locale: Locale, episode_id: number | null)
	{
		if (this.episode && this.episode.episode_id == episode_id) {
			this.episode = this.episode;
			return;
		}
		this.apiService.episode(locale.prefix, {
			episode_id: episode_id
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			let responseResult = this.errorProcessing.auto(data);
			if (responseResult) {
				this.episode = responseResult;
			}
			else {
				this.episode = null;
			}
		});
	}
}
