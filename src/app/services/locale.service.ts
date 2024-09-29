import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Locale } from '../types';

@Injectable({
  providedIn: 'root'
})
export class LocaleService
{
  private _locale : BehaviorSubject<Locale>;

	constructor(private readonly translateService: TranslateService)
	{
		let locale   = this.getFromLocalStorage() || this.getDefaultFromEnv();
		this._locale = new BehaviorSubject( locale );
		this.changeLocale( locale );
	}

	public getFromLocalStorage() : Locale | null
	{
		if (localStorage.hasOwnProperty('locale')) {
			console.log("locale",JSON.parse(localStorage.getItem('locale') || '{}'))
			return JSON.parse(localStorage.getItem('locale') || '{}');
		}
		return null;
	}

	protected getDefaultFromEnv() : Locale
	{
		return this.localeFromEnv(environment.locale) || {
			prefix    : 'ar',
			name      : 'arabic',
			direction : 'rtl',
		};
	}

	public localeFromEnv(locale: string) : Locale | null
	{
		return environment.availableLocales.find(_locale => _locale.prefix === locale) || null;
	}

	public getLocaleObjectFromString(locale: string) : Locale | null
	{
		let _locale = null;
		environment.availableLocales.forEach((item: Locale) => {
			if (item.prefix == locale) {
				_locale = item;
			}
		});
		return _locale;
	}

	public changeLocale(locale: Locale) : void
	{
		this.translateService.setDefaultLang(locale.prefix);
		this.translateService.use(locale.prefix);
	}

	set locale(locale: Locale)
	{
		if (locale) {
			localStorage.setItem('locale', JSON.stringify(locale));
			this._locale.next( locale );
			this.changeLocale( locale );
			window.location.reload();
		}
	}

	get locale$() : Observable<Locale>
	{
		return this._locale.asObservable();
	}
}
