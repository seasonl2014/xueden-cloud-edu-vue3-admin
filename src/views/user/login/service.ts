import request from '@/utils/request';
import { LoginParamsType } from './data.d';

export async function accountLogin(params: LoginParamsType): Promise<any> {
    return request({
        url: '/auth/login',
        method: 'POST',
        data: params,
    });
}

export async function getCodeImg(): Promise<any> {
    return request({
        url: '/code',
        method: 'get'
    });
}
