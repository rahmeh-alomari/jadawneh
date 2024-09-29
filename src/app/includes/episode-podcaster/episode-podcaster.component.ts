import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { Locale, Podcaster, Response } from 'src/app/types';
@Component({
  selector: 'app-episode-podcaster',
  templateUrl: './episode-podcaster.component.html',
  styleUrls: ['./episode-podcaster.component.scss']
})
export class EpisodePodcasterComponent implements OnInit {

  @Input() broadcaster : Podcaster;

	@Input() locale      : Locale | null = null;

	@Output() removedFromFavorites : EventEmitter<Podcaster> = new EventEmitter();

	@Output() addedToFavorites     : EventEmitter<Podcaster> = new EventEmitter();


	constructor(
		private apiService        : ApiService,
		private errorProcessing   : ErrorProcessingService,
	) 
	{
	}

	ngOnInit(): void 
	{
	}

	toggleFavorite()
	{
		this.apiService.togglePodcasterFavorite(this.locale.prefix, {
			broadcaster_id: this.broadcaster['broadcaster_id']
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.errorProcessing.auto(data);
			if (data.code == '002030') {
				this.broadcaster['you_favored_this'] = true;
			}
			else if (data.code == '002040') {
				this.broadcaster['you_favored_this'] = false;
			}
		});
	}

}
