import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Category, Locale } from 'src/app/types';

@Component({
	selector: 'app-category-card',
	templateUrl: './category-card.component.html',
	styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent implements OnInit 
{
	@Input() category : Category;

	@Input() locale   : Locale | null = null;

	constructor() {}

	ngOnInit(): void 
	{
	}
}
