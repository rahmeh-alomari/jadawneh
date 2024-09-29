import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Provider, SocialLoginService } from 'ngx-social-login';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Response, SocialProfile } from 'src/app/types';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy 
{
	private _unsubscribeAll: Subject<any>;

	public locale          : Locale | null = null;

	public form			   : FormGroup;

	constructor(
		private localeService      : LocaleService,
		private apiService		   : ApiService,
		private errorProcessing    : ErrorProcessingService,
		private authService		   : AuthService,
		private formBuilder		   : FormBuilder,
		private router	           : Router,
		private socialLoginService : SocialLoginService
	) 
	{
		this._unsubscribeAll = new Subject();
	}

	ngOnInit(): void 
	{
		this.form = this.formBuilder.group({
            name	    		  : ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            
			password: ['', [
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(20),
				
			  ]],
			  password_confirmation: ['', Validators.required]
			});
		  
        
		this.form.disable();
		this.localeService.locale$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((locale: Locale) => {
			this.locale = locale;
			this.form.enable();
		});
	}

    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	signUp() : void 
	{
		this.form.disable();
		this.apiService.signup(this.locale.prefix, this.form.value)
		.pipe(take(1))
		.subscribe((data: Response) => {
			let responseResult = this.errorProcessing.auto(data);
			if (responseResult) {
				this.authService.user = responseResult.user;
				this.router.navigate(['/', this.locale.prefix, 'home']);
			}
			this.form.enable();
		});		
	}

	loginWithFacebook(): void 
	{
		this.socialLoginService.login(Provider.FACEBOOK)
		.pipe(take(1))
		.subscribe((user) => {
			this.signInUsingSocialMedia({
				social_id          : user.id,
				email 		       : user.email,
				name  		       : user.name,
				registration_type  : 'FACEBOOK',
			});
		});
	}

	loginWithGoogle(): void 
	{
		this.socialLoginService.login(Provider.GOOGLE)
		.pipe(take(1))
		.subscribe((user) => {
			this.signInUsingSocialMedia({
				social_id          : user.id,
				email 		       : user.email,
				name  		       : user.name,
				registration_type  : 'GOOGLE',
			});
		});
	}

	signInUsingSocialMedia(data: SocialProfile) : void 
	{
		this.form.disable();
		this.apiService.signinUsingSocialMedia(this.locale.prefix, data)
		.pipe(take(1))
		.subscribe((data: Response) => {
			let responseResult = this.errorProcessing.auto(data);
			if (responseResult) {
				this.authService.user = responseResult.user;
				this.router.navigate(['/', this.locale.prefix, 'home']);
			}
			this.form.enable();
		});		
	}
}
