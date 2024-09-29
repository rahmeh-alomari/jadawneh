import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Program, Response, Season } from 'src/app/types';
@Component({
  selector: 'app-most-popular',
  templateUrl: './most-popular.component.html',
  styleUrls: ['./most-popular.component.scss']
})
export class MostPopularComponent implements OnInit {
  popularData: any[];
  prefix: any | null;
  
  public    locale       : Locale    | null = null;
  private _unsubscribeAll: Subject<any>;
  constructor(private apiservice: ApiService, private localeService: LocaleService, private activatedroute  : ActivatedRoute) {
    this._unsubscribeAll = new Subject();

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
          this.getMostListened();
        });
      });
    }


  }
  getMostListened(): void {
    this.apiservice.getPopularData(this.locale.prefix).subscribe(
      response => {
        console.log('Most listened data:', response);
        this.popularData = response.map(item => ({
          ...item,
          imageLoaded: false // Add a property to manage the loading state
        }));
      },
      error => {
        console.error('Error fetching most listened data:', error);
      }
    );
  }

  onImageLoad(item: any): void {
    item.imageLoaded = true; // Set imageLoaded to true when the image is fully loaded
  }
}
