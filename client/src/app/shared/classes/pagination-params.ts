import { IPaginationParams } from '../interfaces/i-pagination-params';

export class PaginationParams implements IPaginationParams {
    pageIndex = 1;
    pageSize = this.itemsPerPageOptions()[1];

    itemsPerPageOptions() {
        return [5, 10, 25, 50, 100];
    }
}
