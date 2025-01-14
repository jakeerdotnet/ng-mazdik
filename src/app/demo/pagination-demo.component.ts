import { Component } from '@angular/core';

@Component({
    selector: 'app-pagination-demo',
    template: `
    <app-pagination class="pagination-demo"
      [totalItems]="100"
      [perPage]="10"
      [currentPage]="1"
      [pageSizeOptions]="[10, 20, 30, 50]"
      (pageChanged)="onPageChanged($event)">
    </app-pagination>
  `,
    standalone: false
})
export class PaginationDemoComponent {

  onPageChanged(event): void {
    console.log(event);
  }
}
