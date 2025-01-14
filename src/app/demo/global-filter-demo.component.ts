import { Component, OnInit } from '@angular/core';
import { CdtSettings, DataTable, DataManager } from 'ng-mazdik-lib';
import { DemoService } from './demo.service';
import { getColumnsPlayers } from './columns';

@Component({
    selector: 'app-global-filter-demo',
    template: `<p>Client-side global filter</p>
  <dt-toolbar [table]="table"></dt-toolbar>
  <app-data-table [table]="table"></app-data-table>
  <p>Server-side global filter</p>
  <app-crud-table [dataManager]="dataManager"></app-crud-table>
  `,
    standalone: false
})

export class GlobalFilterDemoComponent implements OnInit {

  table: DataTable;
  dataManager: DataManager;

  settings: CdtSettings;
  serverSideSettings: CdtSettings = new CdtSettings({
    globalFilter: true
  });

  constructor(private service: DemoService) {
    const columns = getColumnsPlayers();
    this.table = new DataTable(columns, this.settings);
    this.dataManager = new DataManager(columns, this.serverSideSettings, this.service);
  }

  ngOnInit(): void {
    this.table.events.onLoading(true);
    fetch('assets/players.json').then(res => res.json()).then(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
