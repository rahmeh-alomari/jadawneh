import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Program, Response, Season } from 'src/app/types';
@Component({
  selector: 'app-most-recent',
  templateUrl: './most-recent.component.html',
  styleUrls: ['./most-recent.component.scss']
})
export class MostRecentComponent implements OnInit {
  mostLisitendData: any[];
  prefix: any | null;
  private _unsubscribeAll: Subject<any>;
  public    locale       : Locale    | null = null;
  constructor(private apiservice: ApiService, private localeService: LocaleService,private cdr: ChangeDetectorRef,private activatedroute  : ActivatedRoute) {
    this._unsubscribeAll = new Subject();

  }

  getmostrecent(){
 this.apiservice.getMostListenedData( this.locale.prefix).subscribe(
      response => {
        this.mostLisitendData = response.map(item => ({
          ...item,
          imageLoaded: false // Add a property to manage the loading state
        }));
        this.cdr.detectChanges();

      },
      error => {
        console.error('Error fetching popular data:', error);
      }
    );
  };

 

  ngOnInit() {
    {
      this.localeService.locale$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((locale: Locale) => {
        this.activatedroute.paramMap
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((params) => {
          this.locale = locale;
          this.getmostrecent();
        });
      });
    }

    console.log('Prefix from localStorage:',this.locale );

  }
 onImageLoad(item: any): void {
  console.log("Item loaded:", item);
  item.imageLoaded = true; // Set imageLoaded to true when the image is fully loaded
  this.cdr.detectChanges(); // Trigger change detection manually
}
}  
