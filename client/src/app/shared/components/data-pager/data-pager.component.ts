import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginationParams } from '../../classes/pagination-params';
import { Pagination } from '../../classes/pagination';

@Component({
  selector: 'app-data-pager',
  templateUrl: './data-pager.component.html',
  styleUrls: ['./data-pager.component.scss']
})
export class DataPagerComponent implements OnInit {
  @Input() pagedData = new Pagination<any>();
  @Input() pagingParams = new PaginationParams();
  @Output() changed = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  pageIndexChanged(e: any) {
    this.pagingParams.pageIndex = e.page;
    this.changed.emit();
  }

  onPageSizeChanged(e: any) {
    this.changed.emit();
  }
}
