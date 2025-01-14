import { Component, OnInit, OnDestroy } from '@angular/core';
import { Settings, DataTable } from 'ng-mazdik-lib';
import { getColumnsPlayers, getColumnsRank, getColumnsInventory } from './columns';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-master-detail-demo',
    template: `
    <app-data-table [table]="dtPlayers"></app-data-table>
    <div style="display:flex;">
      <div style="width: 59%;">
        <app-data-table [table]="dtInventory"></app-data-table>
      </div>
      <div style="width: 1%;"></div>
      <div style="width: 40%;">
        <app-data-table [table]="dtRank"></app-data-table>
      </div>
    </div>
  `,
    standalone: false
})

export class MasterDetailDemoComponent implements OnInit, OnDestroy {

  dtPlayers: DataTable;
  dtInventory: DataTable;
  dtRank: DataTable;

  settings: Settings = new Settings({
    bodyHeight: 250,
  });

  private rank: any = [];
  private inventory: any = [];
  private subscriptions: Subscription[] = [];

  constructor() {
    const columnsPlayers = getColumnsPlayers();
    for (const column of columnsPlayers) {
      column.editable = false;
    }
    const columnsRank = getColumnsRank();
    const columnsInventory = getColumnsInventory();

    this.dtPlayers = new DataTable(columnsPlayers, this.settings);
    this.dtInventory = new DataTable(columnsInventory, this.settings);
    this.dtRank = new DataTable(columnsRank, this.settings);

    const subSelection = this.dtPlayers.events.selectionSource$.subscribe(() => {
      this.masterChanged();
    });
    this.subscriptions.push(subSelection);
  }

  ngOnInit(): void {
    fetch('assets/players.json').then(res => res.json()).then(data => {
      this.dtPlayers.rows = data;
      const masterId = this.dtPlayers.rows[0]['id'];
      this.dtPlayers.selectRow(0);

      fetch('assets/rank.json').then(res => res.json()).then(rank => {
        this.rank = rank;
        this.dtRank.rows = this.rank.filter((value: any) => {
          return value['player_id'] === masterId;
        });
      });
      fetch('assets/inventory.json').then(res => res.json()).then(inventory => {
        this.inventory = inventory;
        this.dtInventory.rows = this.inventory.filter((value: any) => {
          return value['itemOwner'] === masterId;
        });
      });

    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  masterChanged(): void {
    const selection = this.dtPlayers.selection.getSelection();
    if (this.dtPlayers.rows.length > 0 && selection.length !== 0 && this.dtPlayers.rows[selection[0]]) {

      const masterId = this.dtPlayers.rows[selection[0]]['id'];
      this.dtRank.rows = this.rank.filter((value: any) => {
        return value['player_id'] === masterId;
      });
      this.dtInventory.rows = this.inventory.filter((value: any) => {
        return value['itemOwner'] === masterId;
      });
    } else {
      this.dtRank.rows = [];
      this.dtInventory.rows = [];
    }
  }

}
