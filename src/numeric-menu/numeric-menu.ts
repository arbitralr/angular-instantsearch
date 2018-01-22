import { Component, Input, Inject, PLATFORM_ID } from "@angular/core";
import { connectNumericRefinementList } from "instantsearch.js/es/connectors";
import { noop } from "lodash-es";

import { BaseWidget } from "../base-widget";
import { NgAisInstance } from "../instantsearch/instantsearch-instance";

export type NumericRefinementListState = {
  createURL: Function;
  items: {}[];
  refine: Function;
};

@Component({
  selector: "ng-ais-numeric-menu",
  template: `
    <div [class]="cx()">
      <div
        [class]="cx('body')"
        *ngIf="!isHidden"
      >
        <ul [class]="cx('list')">
          <li
            [class]="cx('item') + (item.isRefined ? (' ' + cx('item', 'selected')) : '')"
            *ngFor="let item of state.items"
            (click)="refine($event, item)"
          >
            <label [class]="cx('label')">
              <input
                [class]="cx('radio')"
                type="radio"
                name="NumericRefinementList"
                [checked]="item.isRefined"
              />
              {{item.label}}
            </label>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class NgAisNumericMenu extends BaseWidget {
  @Input() public attributeName: string;
  @Input()
  public options: {
    name: string;
    start?: number;
    end?: number;
  }[];

  public state: NumericRefinementListState = {
    createURL: noop,
    items: [],
    refine: noop
  };

  get isHidden() {
    return this.state.items.length === 0 && this.autoHideContainer;
  }

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    searchInstance: NgAisInstance
  ) {
    super(searchInstance, "NumericMenu");
  }

  public ngOnInit() {
    this.createWidget(connectNumericRefinementList, {
      attributeName: this.attributeName,
      options: this.options
    });
    super.ngOnInit();
  }

  public refine(event: MouseEvent, item: { value: string }) {
    event.preventDefault();
    event.stopPropagation();
    this.state.refine(item.value);
  }
}
