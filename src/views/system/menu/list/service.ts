import request from '@/utils/request';
import { TableListQueryParams, TableListItem } from './data.d';

// 获取菜单列表数据
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/system/menu/treelist',
    method: 'get',
    params,
  });
}

// 添加菜单数据
export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: 'system/menu/addMenu',
    method: 'POST',
    data: params,
  });
}

// 更新菜单数据
export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/system/menu/edit/${id}`,
    method: 'PUT',
    data: params,
  });
}

// 删除菜单数据
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/system/menu/delete/${id}`,
    method: 'delete',
  });
}

// 获取菜单详情数据
export async function detailData(id: number): Promise<any> {
  return request({url: `/system/menu/get/${id}`});
}
