import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[dtRowGroupTemplate]',
    standalone: false
})
export class RowGroupTemplateDirective {
  constructor(public template: TemplateRef<any>) { }
}
