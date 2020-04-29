import { IApiResponse } from './i-api-response';

export interface IApiValidationError extends IApiResponse {
    errors: string[];
}
