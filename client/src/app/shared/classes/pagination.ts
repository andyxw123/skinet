import { IPagination } from '../interfaces/i-pagination';

export class Pagination<T> implements IPagination<T> {
    count: number;
    data: T[];
    pageIndex: number;
    pageSize: number;
}
