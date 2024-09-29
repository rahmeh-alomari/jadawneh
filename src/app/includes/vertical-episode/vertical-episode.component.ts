import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Episode, Locale, Response } from 'src/app/types';
import { StaticPlayerService } from '../static-player.service';

@Component({
	selector: 'app-vertical-episode',
	templateUrl: './vertical-episode.component.html',
	styleUrls: ['./vertical-episode.component.scss'],
})
export class VerticalEpisodeComponent implements OnInit, OnDestroy
{	@Input() applyClass: boolean = false; 

	@Input() item           : Episode;

	@Input() locale         : Locale | null = null;

	@Output() removedFromFavorites : EventEmitter<Episode> = new EventEmitter();

	@Output() addedToFavorites     : EventEmitter<Episode> = new EventEmitter();

	private _unsubscribeAll : Subject<any>;

	constructor(
		private apiService	    : ApiService, 
		private errorProcessing : ErrorProcessingService,
		private staticPlayerService : StaticPlayerService

	) 
	{ 
		this._unsubscribeAll = new Subject();
	}

	ngOnInit(): void 
	{
		
	}

	ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	toggleFavorite()
	{
		this.apiService.toggleEpisodeFavorite(this.locale.prefix, {
			episode_id: this.item.episode_id
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.errorProcessing.auto(data);
			if (data.code == '002030') {
				this.item.you_favored_this = true;
				this.item.favored_by++;
				this.addedToFavorites.emit(this.item);
			}
			else if (data.code == '002040') {
				this.item.you_favored_this = false;
				this.item.favored_by--;
				this.removedFromFavorites.emit(this.item);
			}
		});
	}

	onStateChanged(episode: Episode) : void
	{
		this.staticPlayerService.episode$
		.pipe(take(1))
		.subscribe((_episode: Episode) => {
			if (! _episode) {
				this.staticPlayerService.showMiniPlayer = false;
				this.staticPlayerService.episode 	    = episode;
			}
		});
	}

	onManuelStateChanged(episode: Episode) : void
	{			

		this.staticPlayerService.episode$
		.pipe(take(1))
		.subscribe((_episode: Episode) => {
			this.staticPlayerService.showMiniPlayer = false;
			this.staticPlayerService.episode 	    = episode;
		});
	}
}
