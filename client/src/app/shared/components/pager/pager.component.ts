import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginationParams } from '../../models/pagination-params';
import { Pagination } from '../../models/pagination-T';
import { IValueItem } from '../../models/i-value-item-T';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
  @Input() config = {
    pagerOnly: false,
    showCount: false,
    defaultPageSize: 5,
  };
  
  @Input() pagedData = new Pagination<any>();
  @Input() pagingParams = new PaginationParams();
  @Input() sortOptions: IValueItem<string>[] = [];

  @Output() changed = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (!this.pagingParams.pageSize && this.config.defaultPageSize) {
      this.pagingParams.pageSize = this.itemsPerPageOptions(this.config.defaultPageSize)[0];
    }
  }

  itemsPerPageOptions(defaultPageSize = 5) {
    const result = [defaultPageSize];

    for (let i = 1; i < 5; i++) {
        result.push(result[i - 1] * 2);
    }

    return result;
}

  onPageIndexChanged(e: any) {
    if (this.pagingParams.pageIndex === e.page) {
      // Only fire the event if the page has changed
      // (a change of the pagination component's totalItems can also cause pageChange to fire as well as the pageIndex)
      return;
    }

    this.pagingParams.pageIndex = e.page;
    this.changed.emit(this.pagingParams);
  }

  onChanged(e: any) {
    if (this.pagingParams.pageIndex === undefined)
    {
       this.pagingParams.pageIndex = 1;
    }

    this.changed.emit(this.pagingParams);
  }

}
