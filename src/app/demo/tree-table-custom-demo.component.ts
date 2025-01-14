import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ColumnBase, Settings, DataTable, Row, Tree, TreeNode, TreeFlattener } from 'ng-mazdik-lib';
import { getTreeColumns } from './columns';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tree-table-custom-demo',
    template: `<p>Editable if last level. Summed column Cube_size if has children rows</p>
  <app-data-table class="fact-table" [table]="dataTable"></app-data-table>
  <ng-template #cellTemplate let-row="row" let-value="value" let-column="column">
    {{getSum(row, column, value)}}
  </ng-template>
  <ng-template #cellNodeTemplate let-row="row" let-value="value">
      <div class="datatable-tree-node"
          [style.padding-left.px]="paddingIndent(row)"
          style="cursor: pointer;">
      <i [class]="getExpanderIcon(row)"
          (click)="onExpand(row)">
      </i>
      <span class="datatable-tree-node-content"
          (dblclick)="onExpand(row)">
          <i [ngClass]="getIcon(row)"></i>
          {{row.name}}
      </span>
      </div>
  </ng-template>
  `,
    standalone: false
})
export class TreeTableCustomDemoComponent implements OnInit, OnDestroy {

  dataTable: DataTable;
  settings: Settings = new Settings({
    paginator: false,
    filter: false,
    sortable: false,
    rowClass: this.getRowClass,
    isEditableCellProp: '$$editable',
    rowHeightProp: '$$height',
    selectionMultiple: true,
    selectionMode: 'checkbox',
  });

  @ViewChild('cellTemplate', { static: true }) cellTemplate: TemplateRef<any>;
  @ViewChild('cellNodeTemplate', { static: true }) cellNodeTemplate: TemplateRef<any>;

  private treeFlattener: TreeFlattener;
  private subscriptions: Subscription[] = [];

  constructor() {
    const columns = getTreeColumns();
    this.dataTable = new DataTable(columns, this.settings, null);
    this.dataTable.pager.perPage = 1000;
    this.treeFlattener = new TreeFlattener(this.transformer);
  }

  ngOnInit(): void {
    this.dataTable.columns[1].cellTemplate = this.cellNodeTemplate;
    this.dataTable.columns[4].cellTemplate = this.cellTemplate;
    this.dataTable.events.onLoading(true);
    fetch('assets/tree.json').then(res => res.json()).then(data => {
      this.dataTable.rows = this.prepareTreeData(data);
      this.dataTable.events.onLoading(false);
    });

    const subCheckbox = this.dataTable.events.checkboxSource$.subscribe((event) => {
      this.selectionToggle(event);
    });
    this.subscriptions.push(subCheckbox);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  transformer = (node: TreeNode, level: number) => {
    const data = {
      expandable: true,
      $$level: level,
      expanded: false,
      hasChildren: (node.children && node.children.length > 0)
    };
    return Object.assign(data, node.data);
  }

  prepareTreeData(nodes: TreeNode[]): any[] {
    const tree = new Tree();
    tree.nodes = nodes;
    const rows = this.treeFlattener.flattenNodes(tree.nodes);
    rows.forEach(x => {
      x.$$height = (x.$$level > 1) ? 0 : null;
      x.expanded = !(x.$$level > 0);
      x.$$editable = !x.hasChildren;
      x['cube_size'] = x.hasChildren ? null : x['cube_size'];
    });
    return rows;
  }

  getRowClass(row): any {
    return {
      'row-warrior': row.$$editable,
      'row-sorcerer': (row.$$level === 0),
    };
  }

  getSum(row: Row, column: ColumnBase, value: any): any {
    if (value) {
      return value;
    }
    const descendants = this.getDescendants(row, this.dataTable.rows);
    if (descendants && descendants.length) {
      let sum = 0;
      descendants.forEach(x => sum += parseFloat(x[column.name] || 0));
      return sum;
    }
  }

  paddingIndent(row: Row): number {
    return row.$$level * 10;
  }

  onExpand(row: any): void {
    row.expanded = !row.expanded;
    if (!row.expanded) {
      const descendants = this.getDescendants(row, this.dataTable.rows);
      if (descendants && descendants.length) {
        descendants.forEach(x => { x.$$height = 0; x.expanded = true; });
      }
    } else {
      const descendants = this.getDescendantsByLevel(row, this.dataTable.rows, row.$$level + 1);
      descendants.forEach(x => { x.$$height = null; x.expanded = false; });
    }
  }

  getExpanderIcon(row: any): string {
    if (row.hasChildren && !row.expanded) {
      return 'dt-icon-node dt-icon-collapsed';
    } else if (row.hasChildren) {
      return 'dt-icon-node';
    }
    return '';
  }

  getDescendants(row: Row, rows: Row[]): any[] {
    const results = [];
    for (let i = row.$$index + 1; i < rows.length && row.$$level < rows[i].$$level; i++) {
      results.push(rows[i]);
    }
    return results;
  }

  getDescendantsByLevel(row: Row, rows: Row[], level: number): any[] {
    const results = [];
    for (let i = row.$$index + 1; i < rows.length && row.$$level < rows[i].$$level; i++) {
      if (rows[i].$$level === level) {
        results.push(rows[i]);
      }
    }
    return results;
  }

  selectionToggle(row: Row): void {
    let descendants = this.getDescendants(row, this.dataTable.rows);
    descendants = descendants.map(x => x.$$index);
    this.dataTable.selection.isSelected(row.$$index)
      ? this.dataTable.selection.select(...descendants)
      : this.dataTable.selection.deselect(...descendants);
  }

  getIcon(row: any): string {
    return row.hasChildren ? 'dt-icon-folder' : 'dt-icon-file';
  }

}
