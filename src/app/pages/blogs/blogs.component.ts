import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale } from 'src/app/types';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  public locale          : Locale | null = null;
  private _unsubscribeAll: Subject<any>;
  blogData: any;
  constructor(private apiService		: ApiService,	private localeService   : LocaleService,) {
    this._unsubscribeAll = new Subject();
   }

  ngOnInit(): void {
    this.localeService.locale$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((locale: Locale) => {
			this.locale = locale;
		});
    this.apiService.blog(this.locale.prefix, null).subscribe((res:any)=>{
      if(res){
        console.log("api response",res)
        this.blogData=res.data;
      }
    })
  }

}
