import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[dtHeaderTemplate]',
    standalone: false
})
export class HeaderTemplateDirective {
  constructor(public template: TemplateRef<any>) { }
}
