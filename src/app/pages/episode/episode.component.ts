import { Component, OnInit, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Episode, Locale, Response } from 'src/app/types';
import { ActivatedRoute } from '@angular/router';
import { StaticPlayerService } from 'src/app/includes/static-player.service';

@Component({
	selector: 'app-episode',
	templateUrl: './episode.component.html',
	styleUrls: ['./episode.component.scss'],
	
})
export class EpisodeComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public episode		   : Episode | null = null;

	public locale          : Locale  | null = null;

	constructor(
		private localeService       : LocaleService, 
		private errorProcessing     : ErrorProcessingService, 
		private api				    : ApiService, 
		private activatedroute      : ActivatedRoute,
		private staticPlayerService : StaticPlayerService
	) 
	{
		this._unsubscribeAll = new Subject();
	}

	ngOnInit(): void 
	{
		this.activatedroute.paramMap
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((params) => { 
			this.localeService.locale$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((locale: Locale) => {
				this.locale = locale;
				this.loadData(locale, params.get('id'));
				this.api.markEpisodePlayed(this.locale.prefix, {
					episode_id: params.get('id'),
				})
				.pipe(take(1))
				.subscribe((data: any) => {});
			});
		});
	}

	ngOnDestroy() : void
    {
		this.staticPlayerService.showMiniPlayer = true;
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	loadData(locale: Locale, episode_id: string | null)
	{
		this.staticPlayerService.episode$
		.pipe(take(1))
		.subscribe((episode: Episode | null) => {
			if (episode && episode.episode_id == Number(episode_id)) {
				this.episode = episode;
				this.staticPlayerService.showMiniPlayer = false;
			}
			else {
				this.loadDataFromApi(locale, episode_id);
			}
		});
	}

	loadDataFromApi(locale: Locale, episode_id: string | null)
	{
		this.api.episode(locale.prefix, {
			episode_id: episode_id
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.episode = this.errorProcessing.auto(data);
			console.log('datadatadatadata',data)
			// this.staticPlayerService.episode = this.episode;
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
	{				console.log("episode",this.episode)

		this.staticPlayerService.episode$
		.pipe(take(1))
		.subscribe((_episode: Episode) => {
			this.staticPlayerService.showMiniPlayer = false;
			this.staticPlayerService.episode 	    = episode;
		});
	}
}
