import { Component, Input, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { TreeNode, Tree } from '../tree-lib';

@Component({
  selector: 'app-nav-menu',
  template: `
  <app-nav-item *ngFor="let node of nodes"
    [node]="node"
    [expandedNode]="expandedNode"
    (expand)="expandedNode=$event"
    (linkClicked)="onLinkClicked($event)">
  </app-nav-item>`,
})
export class NavMenuComponent {

  @Input()
  get nodes(): TreeNode[] { return this.tree.nodes; }
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
  }
  @Input() minimize: boolean;

  @Output() linkClicked: EventEmitter<string> = new EventEmitter();

  tree: Tree = new Tree();
  expandedNode: TreeNode;
  private collapsed: boolean = true;

  @HostBinding('class.nav-menu') cssClass = true;

  @HostBinding('class.nav-expanded') get cssClassExp() {
    return (this.minimize) ? !this.collapsed : true;
  }
  @HostBinding('class.nav-collapsed') get cssClassCol() {
    return (this.minimize) && this.collapsed;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.collapsed = false;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.collapsed = true;
  }

  constructor() {}

  onLinkClicked(event) {
    this.linkClicked.emit(event);
  }

}
