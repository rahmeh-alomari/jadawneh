import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appValidateInputDirective]'
})
export class ValidateInputDirectiveDirective {
  @Input() appValidateInput: string;
  constructor(private el: ElementRef, private renderer: Renderer2, private control: NgControl) {
  }
  @HostListener('blur') onBlur(){

    this.validate();
  }
  private validate() {
    const control = this.control.control;
    console.log("controlcontrol",control)

    if (control) {
      if (control.invalid && (control.dirty || control.touched)) {
        this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid red');
        this.renderer.setAttribute(this.el.nativeElement, 'title', this.appValidateInput || "{{ 'This field is required' | translate }}");
        console.log("  this.renderer  this.renderer",this.renderer)

        let errorElem = this.el.nativeElement.nextElementSibling;
        console.log("errorElem",errorElem)

        if (!errorElem || !errorElem.classList.contains('error-message')) {
          errorElem = this.renderer.createElement('small');
          this.renderer.addClass(errorElem, 'error-message');
          this.renderer.setStyle(errorElem, 'color', 'red');
          this.renderer.setStyle(errorElem, 'width', '100%');
          this.renderer.setStyle(errorElem, 'margin', '10px');
          this.renderer.setStyle(errorElem, 'font-size', '0.875em');
          this.renderer.insertBefore(this.el.nativeElement.parentNode, errorElem, this.el.nativeElement.nextSibling);
        }
  
        const errors = control.errors;
        if (errors) {
          if (errors.required) {
            this.renderer.setProperty(errorElem, 'innerText', this.appValidateInput || 'This field is required');
          } else if (errors.email) {
            this.renderer.setProperty(errorElem, 'innerText', 'Invalid email format');
          } else if (errors.passwordStrength) {
            this.renderer.setProperty(errorElem, 'innerText', 'Password must contain uppercase letters, lowercase letters, numbers, and special characters');
          } else {
            this.renderer.setProperty(errorElem, 'innerText', 'Invalid input');
          }
        } else {
          this.renderer.setProperty(errorElem, 'innerText', '');
        }
      } else {
        this.renderer.removeStyle(this.el.nativeElement, 'border');
        this.renderer.removeAttribute(this.el.nativeElement, 'title');
  
        // Remove error message element if present
        const errorElem = this.el.nativeElement.nextElementSibling;
        if (errorElem && errorElem.classList.contains('error-message')) {
          this.renderer.removeChild(this.el.nativeElement.parentNode, errorElem);
        }
      }
    }
  }
}