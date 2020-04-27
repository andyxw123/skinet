import { IPaginationParams } from './i-pagination-params';

export class PaginationParams implements IPaginationParams {
    pageIndex = 1;
    pageSize: number;
    sort?: string;
}
