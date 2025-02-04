import { AxiosRequestConfig } from 'axios';

import {
    failure,
    isFailure,
    isSuccess,
    RemoteDataResult,
    success
} from '../libs/remoteData';
import { axiosInstance } from './instance';

export async function service<S = any, F = any>(config: AxiosRequestConfig): Promise<RemoteDataResult<S, F>> {
    try {
        const response = await axiosInstance(config);

        return success(response.data);
    } catch (err) {
        return failure(err.response ? err.response.data : err.message);
    }
}

export async function applyDataTransformer<S = any, F = any, R = any>(
    servicePromise: Promise<RemoteDataResult<S, F>>,
    transformer: (data: S) => R
): Promise<RemoteDataResult<R, F>> {
    const response = await servicePromise;

    if (isSuccess(response)) {
        return success(transformer(response.data));
    }

    return response;
}

export async function applyErrorTransformer<S = any, F = any, R = any>(
    servicePromise: Promise<RemoteDataResult<S, F>>,
    transformer: (error: F) => R
): Promise<RemoteDataResult<S, R>> {
    const response = await servicePromise;

    if (isFailure(response)) {
        return failure(transformer(response.error));
    }

    return response;
}
