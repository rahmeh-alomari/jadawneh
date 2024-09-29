import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocaleService } from '../services/locale.service';
import { Locale } from '../types';

@Component({
	selector: 'app-auth-layout',
	templateUrl: './auth-layout.component.html',
	styleUrls: ['./auth-layout.component.scss'],
})

export class AuthLayoutComponent implements OnInit, OnDestroy 
{
	private _unsubscribeAll: Subject<any>;

	public locale          : Locale | null = null;

	constructor(
		private localeService   : LocaleService,
		@Inject(DOCUMENT) private document: Document
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
		});

		let bodyTag : HTMLBodyElement = this.document.getElementsByTagName('body')[0];
		bodyTag.classList.add("gr-background");
	}

    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
		let bodyTag : HTMLBodyElement = this.document.getElementsByTagName('body')[0];
		bodyTag.classList.remove("gr-background");
    }
}
