import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Response, User } from 'src/app/types';

@Component({
	selector: 'app-contact-us',
	templateUrl: './contact-us.component.html',
	styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public locale          : Locale | null = null;

	public form			   : FormGroup;

	public user            : User    = null;

	constructor(
		private localeService   : LocaleService,
		private apiService		: ApiService,
		private errorProcessing : ErrorProcessingService,
		private authService		: AuthService,
		private formBuilder		: FormBuilder,
		@Inject(DOCUMENT) private document: Document
	) 
	{
		this._unsubscribeAll = new Subject();
	}

	ngOnInit(): void 
	{
		let bodyTag : HTMLBodyElement = this.document.getElementsByTagName('body')[0];
		// bodyTag.classList.add("gr-background");

		this.form = this.formBuilder.group({
            sender	     : ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
            subject	     : ['', Validators.required],
            message	     : ['', Validators.required],
        });
		this.form.disable();

		this.localeService.locale$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((locale: Locale) => {
			this.locale = locale;
		});

		this.authService.user$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((user: User) => {
			if (user) {
				this.user = user;
				this.form.setValue({
					sender  : this.user.name,
					email   : this.user.email,
					subject : '',
					message : '',
				});
			}
			this.form.enable();
		});
	}

    ngOnDestroy() : void
    {
		let bodyTag : HTMLBodyElement = this.document.getElementsByTagName('body')[0];
		bodyTag.classList.remove("gr-background");
		
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	send() : void 
	{
		this.form.disable();
		this.apiService.contactUs(this.locale.prefix, this.form.value)
		.pipe(take(1))
		.subscribe((data: Response) => {
			let responseResult = this.errorProcessing.auto(data);
			if (responseResult) {
				this.form.setValue({
					sender  : this.user ? this.user.name  : '',
					email   : this.user ? this.user.email : '',
					subject : '',
					message : '',
				});
			}
			this.form.enable();
		});		
	}
}
