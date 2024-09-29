import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Config } from 'protractor';
import { Subject } from 'rxjs';
import { filter, map, startWith, take, takeUntil } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { StaticPlayerService } from '../includes/static-player.service';
import { AuthService } from '../services/auth.service';
import { ErrorProcessingService } from '../services/error-processing.service';
import { LoaderService } from '../services/loader.service';
import { LocaleService } from '../services/locale.service';
import { Episode, Footer, Locale, Response, User } from '../types';
declare var $: any;

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public locale          : Locale | null   = null;

	public userStatus      : boolean 	     = false;

	public user            : User            = null;

	public loading         : boolean         = true;

	public episode         : Episode         = null;

	public showMiniPlayer  : boolean         = false;

	public form			   : FormGroup;

	public email		   : string | null    = null;

	public currentMenu     : string   | null  = 'home';

	public footer		   : Footer   | null  = null;

	public configs		   : Config[] | null  = null;

	public copyRightDate   = new Date().getFullYear();

	constructor(
		private localeService       : LocaleService,
		private apiService          : ApiService,
		private errorProcessing     : ErrorProcessingService,
		private authService         : AuthService,
		private activatedRoute      : ActivatedRoute,
		private router      	    : Router,
		private loaderService       : LoaderService,
		private formBuilder		    : FormBuilder,
		private staticPlayerService : StaticPlayerService
	)
	{
		this._unsubscribeAll = new Subject();
	}
	changeLanguage(language: string) {
		// Get the current URL as a string
		let currentUrl = this.router.url;
		console.log('Current URL:', currentUrl);
	
		// Split the URL by slashes to get segments
		const urlSegments = currentUrl.split('/');
		console.log('URL Segments before change:', urlSegments);
	
		// Replace the language segment (assuming it's the first segment after hash-based routing)
		if (urlSegments.length > 1) {
		  urlSegments[1] = language;
		}
	
		// Join the segments back into a string
		let newUrl = urlSegments.join('/');
		console.log('New URL:', newUrl);
	
		// Add a leading slash if necessary
		if (!newUrl.startsWith('/')) {
			console.log("navigateByUrlnavigateByUrl",newUrl)

		  newUrl = '/' + newUrl;
		}
		console.log("navigateByUrlnavigateByUrl",newUrl)

		// Navigate to the updated URL
		this.router.navigateByUrl(newUrl).then(success => {
		  if (!success) {
			console.error('Navigation failed');
		  }

		});
	  }
	ngOnInit(): void
	{
		this.form = this.formBuilder.group({
            keyword	     : ['', Validators.required],
        });

		this.staticPlayerService.showMiniPlayer$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((state: boolean) => {
			setTimeout(() => {
				this.showMiniPlayer = state;
				console.log("state",this.showMiniPlayer )

			}, 1);
		});

		this.staticPlayerService.episode$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((episode: Episode | null) => {
			

			this.episode = episode;
			console.log("episode",this.episode )
		});

		this.loaderService.loaded$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((loaded: number) => {
			setTimeout(() => {
				this.loading = loaded > 0 ? true : false;
			}, 1);
			console.log("state",loaded )

		});

		this.authService.check$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((status: boolean) => {
			this.userStatus = status;
			console.log("state",this.userStatus )

		});

		this.authService.user$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((user: User) => {

			this.user = user;
			console.log("user",this.user)

		});

		this.localeService.locale$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((locale: Locale) => {
			this.locale = locale;
			// this.loadData();
		});

		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			startWith(this.router),
			map(() => this.activatedRoute.snapshot),
			map(route => {
				while (route.firstChild) {
					route = route.firstChild;
				}
				return route;
			})
		)
		.subscribe((route: ActivatedRouteSnapshot) => {
			this.currentMenu = route.data.activeMenu || null;
			this.form.setValue({
				keyword : route.params.keyword || ''
			});
			if ( $('#mobile-menu-btn').hasClass('new-init')) {
				$('#mobile-menu-btn').removeClass('new-init');
			}
			else if (! $('#mobile-menu-btn').hasClass('collapsed')) {
				$('#mobile-menu-btn').click();
			}
		});

		$(document).on('click', '.nav-item', function() {
			if ( $('#mobile-menu-btn').hasClass('new-init')) {
				$('#mobile-menu-btn').removeClass('new-init');
			}
			else if (! $('#mobile-menu-btn').hasClass('collapsed')) {
				$('#mobile-menu-btn').click();
			}
		})
	}

    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	logout(): void
	{
		this.apiService.signout(this.locale.prefix)
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.authService.logout();
			let responseResult = this.errorProcessing.auto(data);
			if (responseResult) {
				window.location.reload();
			}
		});
	}

	onSearch(): void
	{
		if(this.form.value.keyword) {
			this.router.navigate(['/', this.locale.prefix, 'search', this.form.value.keyword]);
		}
	}

	// loadData()
	// {
	// 	this.apiService.footer(this.locale.prefix)
	// 	.pipe(take(1))
	// 	.subscribe((data: Response) => {
	// 		let _data = this.errorProcessing.auto(data);
	// 		console.log("_data",_data)
	// 		if (_data) {
	// 			this.footer = _data;
	// 		}
	// 	});

	// 	this.apiService.config(this.locale.prefix)
	// 	.pipe(take(1))
	// 	.subscribe((data: Response) => {
	// 		let _data = this.errorProcessing.auto(data);
	// 		if (_data) {
	// 			this.configs = _data.list;
	// 		}
	// 	});
	// }

	closeMiniPlayer(episode: Episode) : void
	{
		// this.staticPlayerService.episode = null;
	}

	openEpisodePage(episode: Episode) : void
	{
		if (this.episode) {
			this.router.navigate(['/', this.locale.prefix, 'episode', episode.episode_id]);
		}
	}

	subscribeToNewsletter()
	{
		this.apiService.subscribeToNewsletter(this.locale.prefix, {
			email: this.email,
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			let Result = this.errorProcessing.auto(data);
		});
	}
}
