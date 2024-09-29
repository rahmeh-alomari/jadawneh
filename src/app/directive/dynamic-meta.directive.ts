import { Directive, Input, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Directive({
  selector: '[appDynamicMeta]'
})
export class DynamicMetaDirective implements OnInit {

  @Input() pageTitle!: string; // Input to accept the title dynamically
  @Input() pageDescription!: string; // Input to accept the description dynamically

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle);
    }

    if (this.pageDescription) {
      this.metaService.updateTag({ name: 'description', content: this.pageDescription });
    }
  }
}
