import { Component, OnInit, Input } from '@angular/core';
import { IPagination } from '../../models/i-pagination-T';

@Component({
  selector: 'app-pager-text',
  templateUrl: './pager-text.component.html',
  styleUrls: ['./pager-text.component.scss']
})
export class PagerTextComponent implements OnInit {
  @Input() pagedData: IPagination<any>;

  constructor() { }

  ngOnInit(): void {
  }

  rangeFrom(): number {
    return ((this.pagedData.pageIndex - 1) * this.pagedData.pageSize) + 1;
  }

  rangeTo(): number {
    const rangeTo = this.pagedData.pageIndex * this.pagedData.pageSize;
    return rangeTo < this.pagedData.count ?  rangeTo : this.pagedData.count;
  }

}
