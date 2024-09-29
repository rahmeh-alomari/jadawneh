import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Response, User } from 'src/app/types';

@Component({
	selector: 'app-profile-update',
	templateUrl: './profile-update.component.html',
	styleUrls: ['./profile-update.component.scss'],
	
})
export class ProfileUpdateComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public locale          : Locale | null = null;

	public user            : User    = null;

	public form			   : FormGroup;

	constructor(
		private localeService   : LocaleService,
		private apiService      : ApiService,
		private errorProcessing : ErrorProcessingService,
		private authService     : AuthService,
		private formBuilder		: FormBuilder,
	) 
	{
		this._unsubscribeAll = new Subject();
	}

	ngOnInit(): void 
	{
		this.form = this.formBuilder.group({
            name	     : ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            sex          : ['', Validators.required],
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
			this.user = user;
			this.form.setValue({
				name  : this.user.name,
				email : this.user.email,
				sex   : this.user.sex.toUpperCase(),
			});
			this.form.enable();
		});
	}

    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	updateProfile() : void
	{
		this.form.disable();
		this.apiService.updateProfile(this.locale.prefix, this.form.value)
		.pipe(take(1))
		.subscribe((data: Response) => {
			console.log(data);
			let responseResult = this.errorProcessing.auto(data);
			if (responseResult) {
				this.authService.user = responseResult.user;
			}
			this.form.enable();
		});	
	}
}
