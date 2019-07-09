import {
  Component, OnInit, Input, HostBinding, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {DataTable, Column} from '../../base';
import {Subscription} from 'rxjs';
import {HeaderTemplateDirective} from '../../directives/header-template.directive';

@Component({
  selector: 'dt-header',
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HeaderComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() headerTemplate: HeaderTemplateDirective;

  @HostBinding('class.datatable-header') cssClass = true;
  @HostBinding('class.dt-sticky-header') cssSticky = true;
  @ViewChild('headerTemplateView', {static: true}) headerTemplateView: ViewContainerRef;

  private subscriptions: Subscription[] = [];
  columnTrackingFn = (i: number, col: Column) => col.name;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
  }

  ngOnDestroy() {
    if (this.headerTemplateView) {
      this.headerTemplateView.clear();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onResizeBegin() {
    this.table.events.onResizeBegin();
  }

  onResize(event: any, column: Column) {
    this.table.events.onResize(event.event);
  }

  onResizeEnd(event, column: Column) {
    column.setWidth(event.width);
    this.table.events.onResizeEnd();
  }

}
