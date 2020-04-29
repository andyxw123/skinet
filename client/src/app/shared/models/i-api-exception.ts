import { IApiResponse } from './i-api-response';

export interface IApiException extends IApiResponse {
    details?: string;
}
