import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Episode, Favorite, Locale, Podcaster, Program, Response } from 'src/app/types';
declare var $: any;

@Component({
	selector: 'app-favorite',
	templateUrl: './favorite.component.html',
	styleUrls: ['./favorite.component.scss'],
	
})
export class FavoriteComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public locale          : Locale   | null = null;

	public favorite        : Favorite | null | boolean = null;

	public page            : number 		  = 1;

	public hasMorePages    : boolean 		  = false;

	public type            : string 		  = 'episodes';

	constructor(
		private localeService   : LocaleService, 
		private authService     : AuthService, 
		private errorProcessing : ErrorProcessingService, 
		private api             : ApiService
	) 
	{
		this._unsubscribeAll = new Subject();
	}

	ngOnInit(): void 
	{
		this.localeService.locale$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((locale: Locale) => {
			this.locale = locale;
			this.loadData();
		});
	}

    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	openTab(tab: string)
	{
		this.favorite     = null;
		this.type 	      = tab;
		this.page 	      = 1;
		this.hasMorePages = false;
		this.loadData();
	}

	nextPage()
	{
		this.page++;
		this.loadData();
	}

	previewsPage()
	{
		this.page--;
		this.loadData();
	}

	removeProgram(program: Program)
	{
		this.favorite['list'].splice(this.favorite['list'].indexOf(program), 1);
	}

	removeEpisode(episode: Episode)
	{
		this.favorite['list'].splice(this.favorite['list'].indexOf(episode), 1);
	}

	removePodcaster(podcaster: Podcaster)
	{
		this.favorite['list'].splice(this.favorite['list'].indexOf(podcaster), 1);
	}

	loadData()
	{
		this.api.favorites(this.locale.prefix, {
			type		: this.type,
			page		: this.page,
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			let responseResult = this.errorProcessing.auto(data);
			if (responseResult) {
				this.favorite        = responseResult;
				this.page            = responseResult.page;
				this.hasMorePages    = responseResult.has_more_pages;
				$.getScript('assets/podcasti/js/custom.js');
			}
			else {
				this.favorite = false;
			}
		});
	}
}
