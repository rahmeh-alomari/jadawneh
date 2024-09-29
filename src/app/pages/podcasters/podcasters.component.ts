import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale } from 'src/app/types';

@Component({
  selector: 'app-podcasters',
  templateUrl: './podcasters.component.html',
  styleUrls: ['./podcasters.component.scss']
})
export class PodcastersComponent implements OnInit {
  currentPage = 1; // Start from page 1
  podcastersData: any[] = []; // Array to hold all podcasters' data
  prefix: any | null;
  public    locale       : Locale    | null = null;
  private _unsubscribeAll: Subject<any>;
  baseImageUrl = 'https://backend.podqasti.com/img/400x400/';
s
  constructor(private apiservice: ApiService, private localeService: LocaleService,private activatedroute  : ActivatedRoute) {
    this._unsubscribeAll = new Subject();
  }

  getPodcasters() {
    this.apiservice.getPodcastersData(this.locale.prefix, this.currentPage).subscribe(
      response => {
        
        const newData = response.result.broadcasters.data.map(item => {
          let imageUrl = item.image; // Default to the image property
      

          // If the locale is not Arabic, find the translated image
          if (this.locale.prefix !== 'ar' && Array.isArray(item.translations)) {
            
            for (const translation of item.translations) {
          

              if ( this.locale.prefix =="en") {
                console.log("Response:", translation.image)
                imageUrl = translation.image;
                break;
              }
            }
          }
  
          return {
            ...item,
            image: imageUrl, // Ensure the image is correctly set based on locale
            imageLoaded: false // Add a property to manage the loading state
          };
        });
        
        this.podcastersData = [...this.podcastersData, ...newData]; // Append new data to existing array
        
        console.log("Updated podcastersData:", this.podcastersData);
      },
      error => {
        console.error('Error fetching podcasters data:', error);
      }
    );
  }
  

  nextPage() {
    this.currentPage++; // Increment current page number
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
    }}
  onImageLoad(item: any): void {
    item.imageLoaded = true; // Set imageLoaded to true when the image is fully loaded
  }
}
