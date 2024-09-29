import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { LocaleService } from '../services/locale.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../types';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss'],
  encapsulation  : ViewEncapsulation.None
})
export class GlobalComponent implements OnInit, OnDestroy
{
  	private _unsubscribeAll: Subject<any>;

	constructor(
		private localeService: LocaleService,
		@Inject(DOCUMENT) private document: Document,
		private activatedroute  : ActivatedRoute,
		private authService		: AuthService,
		private loaderService   : LoaderService,
	)
	{
		this._unsubscribeAll = new Subject();
	}

  	ngOnInit(): void
	{
		this.loaderService.loading();
		window.addEventListener('load', (event) => {
			this.loaderService.completed();
		});

		this.localeService.locale$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((locale) => {
			this.activatedroute.paramMap
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((params) => {
				if (locale.prefix != this.localeService.getLocaleObjectFromString(params.get('locale')).prefix) {
					this.localeService.locale = this.localeService.getLocaleObjectFromString(params.get('locale'));
				}
				this.setHtmlLang(locale.prefix);
				this.setBodyLang(locale.direction);
				this.setCssLang(locale.direction);
			});
		});

		this.authService.user$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((user: User | null) => {});
	}

    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	protected setHtmlLang(lang: string)
	{
		let htmlTag : HTMLHtmlElement = this.document.getElementsByTagName('html')[0];
		htmlTag.lang = lang;
	}

	protected setBodyLang(direction: string)
	{
		let bodyTag : HTMLBodyElement = this.document.getElementsByTagName('body')[0];
		bodyTag.dir = direction
		bodyTag.classList.remove("has-rtl");   //remove the class
		bodyTag.classList.remove("has-ltr");   //remove the class
		if (direction == 'rtl') {
			bodyTag.classList.add("has-rtl");   //add the class
		}
		else {
			bodyTag.classList.add("has-ltr");   //add the class
		}
	}

	protected setCssLang(direction: string)
	{
		let headTag : HTMLHeadElement = this.document.getElementsByTagName('head')[0];
		let existingLink 			  = this.document.getElementById('langCss') as HTMLLinkElement;
		// let cssFile 				  = direction == 'rtl' ? './assets/dashlite/css/dashlite.rtl.min.css' : './assets/dashlite/css/dashlite.min.css';
		// if (existingLink) {
		// 	existingLink.href = cssFile;
		// }
		// else {
		// 	let newLink  = this.document.createElement('link');
		// 	newLink.rel  = 'stylesheet';
		// 	newLink.type = 'text/css';
		// 	newLink.id   = 'langCss';
		// 	newLink.href = cssFile;
		// 	headTag.appendChild(newLink);
		// }
	}
}
