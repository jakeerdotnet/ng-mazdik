import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[appAfterViewFocus]',
    standalone: false
})
export class AfterViewFocusDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void  {
    this.elementRef.nativeElement.focus();
  }

}
