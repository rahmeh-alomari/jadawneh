import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Category, Locale, Program, Response } from 'src/app/types';
declare var $: any;

@Component({
	selector: 'app-category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy
{

	private _unsubscribeAll: Subject<any>;

	public locale          : Locale    | null = null;

	public category        : Category  | null  = null;

	public most_listened   : Program[] | null = null;

	public latest_programs : Program[] | null = null;

	public page            : number 		  = 1;

	public hasMorePages    : boolean 		  = false;

	constructor(
		private localeService   : LocaleService,
		private errorProcessing : ErrorProcessingService,
		private api             : ApiService,
		private activatedroute  : ActivatedRoute
	)
	{
		this._unsubscribeAll = new Subject();
	}

	ngOnInit(): void
	{
		this.localeService.locale$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((locale: Locale) => {
			this.activatedroute.paramMap
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((params) => {
				this.locale = locale;
				this.page   = 1;
				this.loadData(locale, params.get('id'));
			});
		});
	}

    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	loadData(locale: Locale, category_id: string | null)
	{
		this.api.category(locale.prefix, {
			category_id : category_id,
			page		: this.page,
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			let _data = this.errorProcessing.auto(data);
			if (_data) {
				this.category        = _data.category;
				this.hasMorePages    = _data.category.programs.has_more_pages;
				this.most_listened   = _data.most_listened   || null;
				this.latest_programs = _data.latest_programs || null;
			}
			console.log("this.most_listened",this.most_listened)
			$.getScript('assets/podcasti/js/custom.js');
		});
	}
}
