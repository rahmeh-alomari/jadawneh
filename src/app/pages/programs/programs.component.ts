import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Program, Response } from 'src/app/types';
declare var $: any;

@Component({
	selector: 'app-programs',
	templateUrl: './programs.component.html',
	styleUrls: ['./programs.component.scss'],
	
})
export class ProgramsComponent  implements OnInit {
  private _unsubscribeAll: Subject<any>;
  baseImageUrl = 'https://backend.podqasti.com/img/400x400/';
	currentPage = 1; // Start from page 1
	chaneelsData: any[] = []; // Array to hold all podcasters' data
  public    locale       : Locale    | null = null;
	constructor(private apiservice: ApiService, private localeService: LocaleService,private activatedroute  : ActivatedRoute) {
    this._unsubscribeAll = new Subject();

	 
	}
  
	getPodcasters(){
   this.apiservice.getexploreData( this.locale.prefix,  this.currentPage).subscribe(
	response => {
        console.log("Response:", response);
        const newData = response.result.explore.data.map(item => ({
          ...item,
          imageLoaded: false // Add a property to manage the loading state
        }));
        this.chaneelsData = [...this.chaneelsData, ...newData]; // Append new data to existing array

        console.log("Updated chaneelsData:",this.baseImageUrl+ this.chaneelsData[0].image);
      },
      error => {
        console.error('Error fetching podcasters data:', error);
      }
    );
  }

  nextPage() {
  this.currentPage++ // Increment current page number
    this.getPodcasters(); // Fetch data for the updated page
  }

  stripHtmlTags(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
  ngOnInit() {
    {
      this.localeService.locale$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((locale: Locale) => {
        this.activatedroute.paramMap
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((params) => {
          this.locale = locale;
          this.getPodcasters();
        });
      });
    }

    console.log('Prefix from localStorage:',this.locale );

  }
  onImageLoad(item: any): void {
    console.log("itemitemitem",item)
    item.imageLoaded = true; // Set imageLoaded to true when the image is fully loaded
  }
}
