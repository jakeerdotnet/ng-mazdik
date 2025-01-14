import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy, OnChanges, ViewChild
} from '@angular/core';
import { Column, DataTable, FilterOperator } from '../../base';
import { inputFormattedDate, getLastDate, LastDateType } from '../../../common/utils';

@Component({
    selector: 'app-range-filter',
    templateUrl: 'range-filter.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RangeFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() table: DataTable;
  @Input() column: Column;
  @Input() isOpen: boolean;
  @Output() filterClose: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput', { static: false }) filterInput: any;

  matchMode: string;
  value: any;
  valueTo: any;
  operators: any[];
  defaultMatchMode = FilterOperator.EQUALS;

  constructor() { }

  ngOnInit(): void {
    this.operators = [
      { value: FilterOperator.EQUALS, text: this.table.messages.equals },
      { value: FilterOperator.NOT_EQUAL, text: this.table.messages.notEqual },
      { value: FilterOperator.GREATER_THAN, text: this.table.messages.greaterThan },
      { value: FilterOperator.GREATER_THAN_OR_EQUAL, text: this.table.messages.greaterThanOrEqual },
      { value: FilterOperator.LESS_THAN, text: this.table.messages.lessThan },
      { value: FilterOperator.LESS_THAN_OR_EQUAL, text: this.table.messages.lessThanOrEqual },
      { value: FilterOperator.IN_RANGE, text: this.table.messages.inRange },
      { value: FilterOperator.IS_EMPTY, text: this.table.messages.isEmpty },
      { value: FilterOperator.IS_NOT_EMPTY, text: this.table.messages.isNotEmpty },
    ];
  }

  ngAfterViewInit(): void {
    this.setFocus();
  }

  ngOnChanges(): void {
    this.matchMode = this.table.dataFilter.getFilterMatchMode(this.column.name) || this.defaultMatchMode;
    this.value = this.table.dataFilter.getFilterValue(this.column.name);
    this.valueTo = this.table.dataFilter.getFilterValueTo(this.column.name);
    this.setFocus();
  }

  get isValueFilter(): boolean {
    return !this.table.dataFilter.isNonValueFilter(this.matchMode);
  }

  get isRangeFilter(): boolean {
    return this.matchMode === FilterOperator.IN_RANGE;
  }

  saveFilter(): void {
    this.table.dataFilter.setFilter(this.value, this.column.name, this.matchMode, this.valueTo, this.column.dataType);
    this.table.events.onFilter();
  }

  setFocus(): void {
    if (this.filterInput && this.isValueFilter) {
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 1);
    }
  }

  onModeChange(): void {
    if (!this.isValueFilter) {
      this.value = 0;
      this.valueTo = null;
      this.saveFilter();
      this.filterClose.emit(true);
    } else if (this.value === 0) {
      this.value = null;
    }
  }

  lastDate(name: LastDateType): void {
    this.matchMode = FilterOperator.GREATER_THAN_OR_EQUAL;
    this.value = inputFormattedDate(this.column.type, getLastDate(name).toISOString());
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onClickOk(): void {
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onClickCancel(): void {
    this.filterClose.emit(true);
  }

  onClickClear(): void {
    this.value = null;
    this.valueTo = null;
    this.matchMode = this.defaultMatchMode;
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onChangeSelect(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.matchMode = element.value;
    this.onModeChange();
  }

  onInputFilterValue(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.value = element.value;
  }

  onInputFilterValueTo(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.valueTo = element.value;
  }

}
