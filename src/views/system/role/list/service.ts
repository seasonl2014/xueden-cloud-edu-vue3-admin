import request from '@/utils/request';
import { TableListQueryParams, TableListItem } from './data.d';

// 查询角色数据
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/system/role/list',
    method: 'POST',
    params,
  });
}

// 查询菜单数据
export async function queryMenusList(): Promise<any> {
  return request({
    url: '/system/role/getAllMenusList',
    method: 'GET',
  });
}

// 根据角色Id获取角色所具有的菜单
export async function queryRoleMenusList(id: number): Promise<any> {
  return request({
    url: `/system/role/getMenuByRole?id=${id}`,
    method: 'GET',
  });
}

// 保存角色和菜单数据
export async function saveMenuData(roleId: number, menuIds: string[]): Promise<any> {
  return request({
    url: `/system/role/saveMenu/${roleId}`,
    method: 'POST',
    data: menuIds,
  });
}

// 新增角色数据
export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/system/role/create',
    method: 'POST',
    data: params,
  });
}

// 更新角色数据
export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/system/role/edit/${id}`,
    method: 'PUT',
    data: params,
  });
}

// 删除角色数据
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/system/role/delete/${id}`,
    method: 'delete',
  });
}

// 根据角色Id获取角色信息
export async function detailData(id: number): Promise<any> {
  return request({url: `/system/role/get/${id}`});
}
