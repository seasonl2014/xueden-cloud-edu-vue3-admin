import request from '@/utils/request';
import { TableListQueryParams } from './data.d';

// 查询列表数据
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/system/log/list',
    method: 'POST',
    params,
  });
}

// 删除单条数据
export async function removeData(id: number): Promise<any> {

  return request({
    url: `/system/log/delete/${id}`,
    method: 'DELETE',
    timeout:300000
  });
}

// 批量删除数据
export async function removeBatchData(ids: Array<string>): Promise<any> {
  return request({
    url: '/system/log/deleteBatch',
    method: 'DELETE',
    data: ids,
  });
}


