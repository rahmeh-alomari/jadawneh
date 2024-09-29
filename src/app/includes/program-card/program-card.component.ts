import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { Locale, Program, Response } from 'src/app/types';

@Component({
	selector: 'app-program-card',
	templateUrl: './program-card.component.html',
	styleUrls: ['./program-card.component.scss'],
})
export class ProgramCardComponent implements OnInit 
{
	@Input() program        	   : Program;

	@Input() locale         	   : Locale   | null   = null;

	@Input() view            	   : 'slider' | 'card' = 'card';

	@Input() footer                : boolean 		   = true;

	@Input() counters              : boolean 		   = true;

	@Output() removedFromFavorites : EventEmitter<Program> = new EventEmitter();

	@Output() addedToFavorites     : EventEmitter<Program> = new EventEmitter();

	constructor(
		private errorProcessing : ErrorProcessingService, 
		private api			    : ApiService,
	) 
	{ 
	}

	ngOnInit(): void 
	{
		console.log("program",this.program)
	}

	toggleFavorite()
	{
		this.api.toggleProgrameFavorite(this.locale.prefix, {
			program_id: this.program.program_id
		})
		.pipe(take(1))
		.subscribe((data: Response) => {
			this.errorProcessing.auto(data);
			
			if (data.code == '102005') {
				this.program.you_favored_this = true;
				this.program.favored_by++;
				this.addedToFavorites.emit(this.program);
			}
			else if (data.code == '102006') {
				this.program.you_favored_this = false;
				this.program.favored_by--;
				this.removedFromFavorites.emit(this.program);
			}
		});
	}
}
