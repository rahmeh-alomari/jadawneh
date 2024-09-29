import { Component, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Player } from '@vime/angular';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { Episode, Locale, Response } from 'src/app/types';
import { StaticPlayerService } from '../static-player.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
	selector: 'app-mini-player',
	templateUrl: './mini-player.component.html',
	styleUrls: ['./mini-player.component.scss'],
})
export class MiniPlayerComponent implements OnInit, OnDestroy
{
	@ViewChild('player') player !: Player;

	duration			 : string = '00:00';

	currentTimeInSeconds : string = '00:00';

	currentTime         = 0;

	isPlaying           = false;

	canSetPlaybackRate  = false;

	playbackRates       = [1];

	currentPlaybackRate = 1;

	@Input() episode : Episode;

	@Input() locale  : Locale;

	@Output() onClose      : EventEmitter<Episode> = new EventEmitter();

	@Output() onMainPlayer : EventEmitter<Episode> = new EventEmitter();

	private _unsubscribeAll: Subject<any> = new Subject();
	miniPlayerVisible: boolean;

	constructor(
		private apiService	        : ApiService, 
		private errorProcessing     : ErrorProcessingService,
		private staticPlayerService : StaticPlayerService,
		private router: Router,
	) 
	{
	}


	ngOnInit(): void {
		this.staticPlayerService.episode$
		   .pipe(takeUntil(this._unsubscribeAll))
		   .subscribe((episode: Episode) => {
			  this.episode = episode;
		   });
	 
		// Listen for route changes and trigger cleanup
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			takeUntil(this._unsubscribeAll)
		 ).subscribe(() => {
			console.log("Route changed, closing mini player.");
			this.closeMiniPlayer();
		 });
	 }
	ngOnDestroy() : void
    {
		this.closeMiniPlayer();
		this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
	}
	
	setDuration(evnet: CustomEvent<number>)
	{
		this.duration = this.numberToTime(evnet.detail);
	}

	toggleState() 
	{
		if (this.isPlaying) {
			this.isPlaying = false;
			this.player.pause();
		}
		else {
			this.isPlaying = true;
			this.player.play();
		}
	}

	stateChanged(event: CustomEvent<boolean>)
	{
		this.isPlaying = ! event.detail;
		this.touch();
	}

	numberToTime(number: number)
	{
		return new Date(number * 1000).toISOString().substr(11, 8);
	}

	timeToNumber(time: string) : number
	{
		let actualTime = time.split(':');
		return (+actualTime[0]) * 60 * 60 + (+actualTime[1]) * 60 + (+actualTime[2]);
	}

	CurrentTimeChange(evnet: CustomEvent<number>)
	{
		this.currentTime	      = evnet.detail;
		this.currentTimeInSeconds = this.numberToTime(this.currentTime);
	}

	onSeek(event: CustomEvent<void>)
	{
		this.touch();
	}

	onReady(event: CustomEvent<void>)
	{
	}

	PlaybackReady(evnet: CustomEvent<void>)
	{
		this.currentTime = Number(this.timeToNumber(this.episode.paused_at).toFixed(2));
		this.player.canSetPlaybackRate().then((result) => {
			if (result) {
				this.canSetPlaybackRate  = true;
				this.player.playbackRates.map((rate) => { 
					if ((rate == 1.5 || rate == 2) ) {
						this.playbackRates.push(rate);
					}
				});
			}
		});
	}

	setPlayBackSpeed(rate: number)
	{
		this.player.playbackRate = rate;
		this.currentPlaybackRate = rate;
	}

	changePlayBackRate()
	{
		let foundNext = false;
		this.playbackRates.some((rate, index) => {
			if (rate > this.currentPlaybackRate) {
				this.player.playbackRate = rate;
				this.currentPlaybackRate = rate;
				return foundNext = true;
			}
		});
		if (! foundNext) {
			this.player.playbackRate = 1;
			this.currentPlaybackRate = 1;
		}
	}

	seekForward() 
	{
		this.currentTime += 10;
	}

	seekBackward() 
	{
		if (this.currentTime - 10 < 0) {
			this.currentTime = 0;
		}
		else {
			this.currentTime -= 10;
		}
	}

	toggleFavorite()
	{
		this.apiService.toggleEpisodeFavorite(this.locale.prefix, {
			episode_id: this.episode.episode_id
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.errorProcessing.auto(data);
			if (data.code == '002030') {
				this.episode.you_favored_this = true;
				this.episode.favored_by++;
			}
			else if (data.code == '002040') {
				this.episode.you_favored_this = false;
				this.episode.favored_by--;
			}
		});
	}

	touch()
	{
		this.apiService.touchEpisode(this.locale.prefix, {
			episode_id: this.episode.episode_id,
			paused_at: this.numberToTime(this.currentTime),
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			let responseResult = this.errorProcessing.auto(data);
		});
	}

	closeMiniPlayer() : void
	{
		if (this.episode) {
			this.episode.paused_at = this.numberToTime(this.currentTime);
			this.staticPlayerService.episode = this.episode;
			this.touch();
		}
		this.staticPlayerService.episode = null;
		this.onClose.emit(this.episode);
		this.miniPlayerVisible = false; // Assuming this controls visibility

	}

	openMainPlayer() : void
	{
		this.onMainPlayer.emit(this.episode);
	}

}
