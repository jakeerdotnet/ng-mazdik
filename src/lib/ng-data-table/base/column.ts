import { ColumnBase } from './column-base';
import { isBlank, getDeepValue } from '../../common/utils';
import { DataType } from './types';
import { Settings } from './settings';
import { SelectItem } from '../../common';

export class Column extends ColumnBase {

  index: number;
  filterValuesTemp: SelectItem[] = [];

  get containsDots(): boolean {
    return (this.name.indexOf('.') >= 0);
  }

  get isDateType(): boolean {
    return (this.type === 'date' || this.type === 'datetime-local' || this.type === 'month');
  }

  constructor(init: Partial<ColumnBase>, private settings: Settings) {
    super();
    Object.assign(this, init);
    this.setSettings();
  }

  private setSettings() {
    /* disable sort for all column */
    if (this.settings.sortable === false) {
      this.sortable = false;
    }
    /* disable filter for all column */
    if (this.settings.filter === false) {
      this.filter = false;
    }
    // hide if column is grouped
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      if (this.settings.groupRowsBy.indexOf(this.name) >= 0) {
        this.tableHidden = true;
      }
    }
    this.setDefaults();
  }

  private setDefaults() {
    if (!this.width) {
      this.width = 150;
    }
    if (this.width < this.minWidth) {
      this.width = this.minWidth;
    }
    if (this.width > this.maxWidth) {
      this.width = this.maxWidth;
    }
    if (!this.type) {
      if (this.options) {
        this.type = 'select';
      } else {
        this.type = 'text';
      }
    }
    if (!this.dataType) {
      if (this.isDateType) {
        this.dataType = DataType.Date;
      } else if (this.type === 'number') {
        this.dataType = DataType.Number;
      }
    }
  }

  getOptions(dependsValue?: any): SelectItem[] {
    if (this.options) {
      if (this.dependsColumn && dependsValue) {
        return this.options.filter((value) => value.parentId === dependsValue);
      } else {
        return this.options;
      }
    }
  }

  getOptionName(value: any) {
    const options = this.getOptions();
    if (!options || isBlank(value)) {
      return value;
    }
    const el = options.find(o => o.id.toString() === value.toString());
    return (el) ? el.name : null;
  }

  validate(value: any): string[] {
    if (this.validatorFunc && this.editable) {
      return this.validatorFunc(this.title, value);
    }
    return [];
  }

  setWidth(width: number) {
    if (width <= this.minWidth) {
      width = this.minWidth;
    } else if (width >= this.maxWidth) {
      width = this.maxWidth;
    }
    this.width = width;
  }

  getValue(row: any) {
    if (!row) {
      return '';
    }
    if (this.containsDots) {
      return getDeepValue(row, this.name);
    } else {
      return row[this.name];
    }
  }

  getValueView(row: any) {
    let value = this.getValue(row);
    if (value) {
      value = this.getOptionName(value);
    }
    if (this.pipe) {
      value = this.pipe.transform(value);
    }
    return value;
  }

  getFilterValues(): Promise<SelectItem[]> {
    if (this.filterValues && typeof this.filterValues === 'function') {
      return this.filterValues(this.name);
    } else if (this.filterValues && this.filterValues instanceof Array) {
      return Promise.resolve(this.filterValues);
    } else if (this.options) {
      return Promise.resolve(this.options);
    }
    return Promise.resolve([]);
  }

}