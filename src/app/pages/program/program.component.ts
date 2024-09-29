import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Program, Response, Season } from 'src/app/types';
declare var $ : any;

@Component({
	selector: 'app-program',
	templateUrl: './program.component.html',
	styleUrls: ['./program.component.scss'],
	
})
export class ProgramComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public    locale       : Locale    | null = null;

	public program		   : any   | null | boolean = null;

	constructor(
		private localeService   : LocaleService,
		private errorProcessing : ErrorProcessingService,
		private api			    : ApiService,
		private activatedroute  : ActivatedRoute
	)
	{
		this._unsubscribeAll = new Subject();
		
	}

	ngOnInit(): void
	{

		this.localeService.locale$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((locale: Locale) => {
			this.activatedroute.paramMap
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((params) => {
				this.locale = locale;
				this.loadData(params.get('id'));
			});
		});
		console.log("program.season_count",this.program)

	}

    ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
	loadData(id: string | null = null, season: Season | null = null): void {
		this.api.program(this.locale.prefix, {
		  program_id: id || (this.program ? this.program['program_id'] : null),
		  season_id: season ? season.season_id : null
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
		  console.log("data", data);
		  this.program = this.errorProcessing.auto(data);
		  console.log("this.program", this.program);
	  
		  // Extract text content from description and pdcaster
		  let tempPar = document.createElement('p');
		  tempPar.innerHTML = this.program.description;
		  this.program.description = tempPar.textContent || tempPar.innerText;
	  
		  // Process broadcasters
		  this.program.broadcasters = this.program.broadcasters.map(broadcaster => {
			let tempParTitle = document.createElement('p');
			tempParTitle.innerHTML = broadcaster.title;
			broadcaster.title = tempParTitle.textContent || tempParTitle.innerText;
	  
			let tempParImage = document.createElement('img');
			tempParImage.src = broadcaster.image;
			broadcaster.image = tempParImage.src;
	  
			return broadcaster;
		  });
	  
		  $.getScript('assets/podcasti/js/custom.js');
		});
	  }
	  
	

	toggleFavorite(programe: Program)
	{
		this.api.toggleProgrameFavorite(this.locale.prefix, {
			program_id: programe.program_id
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.errorProcessing.auto(data);
			if (data.code == '102005') {
				programe.you_favored_this = true;
				programe.favored_by++;
			}
			else if (data.code == '102006') {
				programe.you_favored_this = false;
				programe.favored_by--;
			}
		});
	}
	stripHtmlTags(html: string): string {
		const doc = new DOMParser().parseFromString(html, 'text/html');
		return doc.body.textContent || "";
	  }
	  selectSeason(season: any) {
		this.program.seasons.forEach(s => s.selected = false);
		season.selected = true;
	  }
}
