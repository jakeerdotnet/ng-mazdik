import {Column} from './column';
import {Settings} from './settings';

export class Dimensions {

  bodyHeight: number;
  actionColumnWidth: number = 40;
  columnMenuWidth: number = 220;
  columnsTotalWidth: number;
  headerRowHeight: number;
  rowHeight: number = 30;
  offsetX: number = 0;
  offsetY: number = 0;
  headerTemplateHeight: number = 0;

  constructor(settings: Settings, private readonly columns: Column[]) {
    this.bodyHeight = settings.bodyHeight;
    this.rowHeight = settings.rowHeight;
    this.headerRowHeight = settings.headerRowHeight;
    this.actionColumnWidth = settings.actionColumnWidth;
    this.calcColumnsTotalWidth();
  }

  calcColumnsTotalWidth() {
    this.columnsTotalWidth = this.columns.filter(x => !x.tableHidden).reduce((acc, cur) => acc + cur.width, this.actionColumnWidth);
  }

}
