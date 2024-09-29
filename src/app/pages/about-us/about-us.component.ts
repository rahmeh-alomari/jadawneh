import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Page, Response } from 'src/app/types';

@Component({
	selector: 'app-about-us',
	templateUrl: './about-us.component.html',
	styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public locale          : Locale | null = null;

	public page			   : Page 	| null = null;

	constructor(
		private localeService      : LocaleService,
		private apiService		   : ApiService,
		private errorProcessing    : ErrorProcessingService
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

	loadData()
	{
		this.apiService.page(this.locale.prefix, {
			type : 'pages',
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			let _data = this.errorProcessing.auto(data);
			if (_data) {
				console.log("_data",_data)
				_data.list.forEach((page: Page) => {
					if (page.content_id == 365) {
						this.page = page;
					}
				});
			}
		});
	}
}
