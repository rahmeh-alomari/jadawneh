import { Injectable } from '@angular/core';
import { Locale, Response } from '../types';
import { ToastrService } from 'ngx-toastr';
import { LocaleService } from './locale.service';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class ErrorProcessingService
{
	private reportSwal = [
		'000004',
	];
	private reportToast = [
		'101001',
		'102005',
		'102006',
		'002030',
		'002040',
		'101003',
		'001005',
		'001003',
		'107001',
		'422',
	];
	private codes = [
		'000004',
		'101001',
		'102005',
		'102006',
		'002030',
		'002040',
		'101003',
		'001005',
		'001003',
		'107001',
		'422',
		'Sign in',
		'Cancel',
	];
	private codesMapping = {};

	private locale : Locale = null;

	constructor(
		private toastrService    : ToastrService,
		private localeService    : LocaleService,
		private translateService : TranslateService,
		private router	         : Router
	)
	{
		this.translateService.get(this.codes)
		.pipe(take(1))
		.subscribe((data) => {
			this.codes.forEach((code) => {
				this.codesMapping[ code ] = {
					title : data[code] ? (data[code].title || data[code]) : code,
					text  : data[code] ? data[code].text  				  : 'No Internet',
				};
			});
		})

		this.localeService.locale$
		.pipe(take(1))
		.subscribe((locale: Locale) => {
			this.locale = locale;
		});
	}

	auto(data: Response)
	{
		if (data.success) {
			if (this.reportToast.includes(data.code)) {
				this.toast(data);
			}
			else if (this.reportSwal.includes(data.code)) {
				this.swal(data);
			}
			return data.result || true;
		}

		if (this.reportToast.includes(data.code)) {
			this.toast(data);
		}
		else if (this.reportSwal.includes(data.code)) {
			this.swal(data);
		}
		else {
			this.toast(data);
		}
		return false;
	}

	toast(data: Response): void
	{
		let translation = this.getCodeTranslations(data);
		let direction = this.locale.direction == 'ltr' ? 'right' : 'left';
		let options = {
			positionClass     : 'toast-bottom-' + direction,
			preventDuplicates : true,
			// timeOut		      : 0,
			// extendedTimeOut    : 0,
			// closeButton	      : true
		};
		if (data.success) {
			this.toastrService.success(translation.text, translation.title, options);
		}
		else {
			this.toastrService.error(translation.text, translation.title, options);
		}
	}

	swal(data: Response): void
	{
		let translation = this.getCodeTranslations(data);
		let style       = this.locale.direction == 'ltr' ? 'right' : 'left';
		if (data.code == '000004') {
			
			Swal.fire({
				// icon		      : 'warning',
  				// iconHtml		  : '؟',
				 
				  showCloseButton: true,
				  iconColor:"red",
				title			  : '<span style="color: #542779 ">'+ translation.title +'</span>',
				
				html: '<span style="color: #92278f;">'+translation.text+'</span>',

				confirmButtonColor: '#92278f',
				confirmButtonText : '<i style="margin-'+ style +': 10px;"></i>'+ this.codesMapping['Sign in'].title,
			
				reverseButtons	  : this.locale.direction == 'rtl',
			})
			.then((result) => {
				if (result.isConfirmed) {
					this.router.navigate(['/', this.locale.prefix, 'account', 'sign-in']);
				}
				else if (result.dismiss === Swal.DismissReason.cancel) {}
			})
		}
		else {
			Swal.fire(translation.title, translation.text, data.success ? 'success' : 'error')
		}
	}

	getCodeTranslations(data: Response) : { title: string, text: string }
	{
		if (this.codesMapping[ data.code ] && this.codesMapping[ data.code ].title && this.codesMapping[ data.code ].text) {
			return this.codesMapping[ data.code ];
		}
		else {
			return {
				title  : data.code,
				text   : data.message
			};
		}
	}
}
