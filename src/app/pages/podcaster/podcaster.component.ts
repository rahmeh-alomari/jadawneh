import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Podcaster, Response } from 'src/app/types';
declare var $: any;

@Component({
	selector: 'app-podcaster',
	templateUrl: './podcaster.component.html',
	styleUrls: ['./podcaster.component.scss'],
	
})
export class PodcasterComponent implements OnInit, OnDestroy 
{
	private _unsubscribeAll: Subject<any>;

	public locale          : Locale    | null           = null;

	public podcaster       : Podcaster | null  = null;

	constructor(
		private localeService     : LocaleService,
		private apiService        : ApiService,
		private errorProcessing   : ErrorProcessingService,
		private activatedroute    : ActivatedRoute
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
			this.activatedroute.paramMap
			.pipe(take(1))
			.subscribe((params) => { 
				this.loadData(params.get('id'));
			});
		});
	}
	stripHtmlTags(html: string): string {
		const doc = new DOMParser().parseFromString(html, 'text/html');
		return doc.body.textContent || "";
	  }
	ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	loadData(id: string | null)
	{
		this.apiService.podcaster(this.locale.prefix, {
			broadcaster_id: id
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			console.log(data);
			let responseResult = this.errorProcessing.auto(data);
			if (responseResult) {
				this.podcaster = data.result;
			}
			$.getScript('assets/podcasti/js/custom.js');
		});
	}

	toggleFavorite()
	{
		this.apiService.togglePodcasterFavorite(this.locale.prefix, {
			broadcaster_id: this.podcaster['broadcaster_id']
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.errorProcessing.auto(data);
			if (data.code == '002030') {
				this.podcaster['you_favored_this'] = true;
			}
			else if (data.code == '002040') {
				this.podcaster['you_favored_this'] = false;
			}
		});
	}
}
