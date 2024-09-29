import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Category, Locale, Response } from 'src/app/types';

@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public locale          : Locale     | null = null;

	public categories	   : Category[] | null | boolean = null;

	public page            : number 		  = 1;

	public hasMorePages    : boolean 		  = false;

	constructor(
		private localeService   : LocaleService,
		private errorProcessing : ErrorProcessingService,
		private api				: ApiService
	)
	{
		this._unsubscribeAll = new Subject();
	}

	ngOnInit(): void
	{
		this.localeService.locale$
		.subscribe((locale: Locale) => {
			this.locale = locale;
			this.page   = 1;
			this.loadData(locale);
		});
	}

    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	loadData(locale: Locale)
	{
		this.api.categories(locale.prefix, {
			page: this.page,
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			let _data = this.errorProcessing.auto(data);
			if (_data) {
				this.categories   = _data.categories;
				this.hasMorePages = _data.has_more_pages;
			}
		});
	}
}
