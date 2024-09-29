import { Component, OnInit, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Home, Locale, Response } from 'src/app/types';
declare var $: any;
import { Meta, Title } from '@angular/platform-browser';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	
})
export class HomeComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public home			   : Home   | null | boolean = null;

	public locale          : Locale | null = null;
	constructor(
		private localeService   : LocaleService,
		private authService     : AuthService,
		private errorProcessing : ErrorProcessingService,
		private api             : ApiService,
		private titleService: Title, private metaService: Meta
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
      localStorage.setItem("LANG",this.locale.prefix)
			this.loadData();
		});

		// this.authService.check$
		// .pipe(takeUntil(this._unsubscribeAll))
		// .subscribe((status: boolean) => {
		// 	this.loadData();
		// });
		
	}



    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	loadData()
	{
		this.api.home(this.locale.prefix)
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.home = this.errorProcessing.auto(data);
			console.log("this.home",this.home)
			$.getScript('assets/podcasti/js/custom.js');
		});
	}
	carouselItems = [
		{ src: '../../../assets/images/blog-1.jpg', alt: 'Image 1' },
		{ src: '../../../assets/images/blog-2.png', alt: 'Image 2' },
		{ src: '../../../assets/images/blog-3.jpg', alt: 'Image 3' },
		{ src: '../../../assets/images/blog-4.webp', alt: 'Image 4' },
		{ src: '../../../assets/images/blog-5.png', alt: 'Image 5' }
	  ];
	  customOptions: any = {
		loop: true,
		margin: 10,
		nav: true,
		navText: [
		  '<i class="fa fa-chevron-left"></i>', 
		  '<i class="fa fa-chevron-right"></i>'
		],
		responsive: {
		  0: {
			items: 1
		  },
		  600: {
			items: 3
		  },
		  1000: {
			items: 3      }
		}
	  }
	
	  ngAfterViewInit() {
		$('.owl-carousel').owlCarousel(this.customOptions);
	  }
}
