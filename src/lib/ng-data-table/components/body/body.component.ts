import {
  Component, Input, HostBinding, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild
} from '@angular/core';
import {DataTable, Row} from '../../base';
import {Subscription} from 'rxjs';
import {RowGroupTemplateDirective} from '../../directives/row-group-template.directive';

@Component({
  selector: 'dt-body',
  templateUrl: './body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() loading: boolean;
  @Input() rowGroupTemplate: RowGroupTemplateDirective;
  @Input() viewRows: Row[] = [];

  @HostBinding('class') cssClass = 'datatable-body';

  private subscriptions: Subscription[] = [];
  rowTrackingFn = (index: number, row: any) => (this.table.settings.trackByProp) ? row[this.table.settings.trackByProp] : index;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subRows);
    this.subscriptions.push(subFilter);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
