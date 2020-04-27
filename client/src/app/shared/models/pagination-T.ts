import { IPagination } from './i-pagination-T';

export class Pagination<T> implements IPagination<T> {
    count: number;
    data: T[];
    pageIndex: number;
    pageSize: number;
}
