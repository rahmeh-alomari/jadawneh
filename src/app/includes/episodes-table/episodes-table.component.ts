import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { Episode, Locale, Response } from 'src/app/types';

@Component({
	selector: 'app-episodes-table',
	templateUrl: './episodes-table.component.html',
	styleUrls: ['./episodes-table.component.scss'],
})
export class EpisodesTableComponent implements OnInit 
{
	@Input() episodes : Episode[];

	@Input() locale   : Locale | null = null;
	activeDropdown: number | null = null;
	constructor(
		private apiService	    : ApiService, 
		private errorProcessing : ErrorProcessingService, 
	) 
	{
	}

	ngOnInit(): void 
	{
	}

	toggleFavorite(episode: Episode)
	{
		this.apiService.toggleEpisodeFavorite(this.locale.prefix, {
			episode_id: episode.episode_id
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.errorProcessing.auto(data);
			if (data.code == '002030') {
				episode.you_favored_this = true;
				episode.favored_by++;
			}
			else if (data.code == '002040') {
				episode.you_favored_this = false;
				episode.favored_by--;
			}
		});
	}

	toggleDropdown(index: number) {
		// Toggle the dropdown visibility
		this.activeDropdown = this.activeDropdown === index ? null : index;
	  }
}
