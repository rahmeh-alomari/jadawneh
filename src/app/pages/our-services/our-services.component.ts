import { Locale } from 'src/app/types';
import { LocaleService } from './../../services/locale.service';
import { Component, OnInit } from '@angular/core';
import { getLocaleId } from '@angular/common';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss']
})
export class OurServicesComponent implements OnInit {
  public locale          : Locale | null = null;

  constructor(private localeService: LocaleService) {
    this.localeService.locale$
		.subscribe((locale: Locale) => {
			this.locale = locale;
		})
  }

  ngOnInit(): void {}
}
