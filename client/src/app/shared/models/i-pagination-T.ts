import { IPaginationParams } from './i-pagination-params';

export interface IPagination<T> extends IPaginationParams {
  count: number;
  data: T[];
}
