import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Category, Episode, Locale, Podcaster, Response } from 'src/app/types';
declare var $: any;

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],

})
export class SearchComponent implements OnInit, OnDestroy {
	private _unsubscribeAll: Subject<any>;

	public locale: Locale | null = null;

	public episodes: Episode[] | null = null;

	public page: number = 1;

	public hasMorePages: boolean = false;

	public keyword: string = null;
	categories: Category[] | null = null;
	broadcasters: Podcaster[] | null = null;

	constructor(
		private localeService: LocaleService,
		private errorProcessing: ErrorProcessingService,
		private apiService: ApiService,
		private activatedroute: ActivatedRoute
	) {
		this._unsubscribeAll = new Subject();
	}

	ngOnInit(): void {
		this.activatedroute.paramMap
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((params) => {
				this.keyword = params.get('keyword');
				this.localeService.locale$
					.pipe(takeUntil(this._unsubscribeAll))
					.subscribe((locale: Locale) => {
						this.locale = locale;
						this.page = 1;
						this.episodes = [];
						this.loadData(locale);
					});
			});
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
		
	}

	nextPage() {
		this.page++;
		this.loadData(this.locale);
	}

	loadData(locale: Locale) {
		// Clear previous data before making the request
		this.episodes = [];
		this.categories = [];
		this.broadcasters = [];
	  
		console.log('Cleared previous data');
	  
		this.apiService.search(locale.prefix, {
		  page: this.page,
		  search: this.keyword,
		})
		  .pipe(takeUntil(this._unsubscribeAll)) // Automatically unsubscribe when _unsubscribeAll emits
		  .subscribe((data: any) => {
			console.log("_data.result_data.result_data.result", data.result);
	  
			if (data && data.success) {
			  // Ensure that data is properly initialized before pushing
			  this.episodes = data.result.episode || [];
			  this.categories = data.result.categories || [];
			  this.broadcasters = data.result.broadcasters || [];
	  
			  console.log("Episodes: ", this.episodes);
			  console.log("Categories: ", this.categories);
			  console.log("Broadcasters: ", this.broadcasters);
	  
			  // Update pagination info
			  this.hasMorePages = data.result.has_more_pages || false;
	  
			  // Optionally load external scripts if needed
			  $.getScript('assets/podcasti/js/custom.js');
			} else {
			  console.error('Failed to load data:', data.message || 'Unknown error');
			}
		  }, (error) => {
			console.error('Error loading data:', error);
		  });
	  }
	  

}