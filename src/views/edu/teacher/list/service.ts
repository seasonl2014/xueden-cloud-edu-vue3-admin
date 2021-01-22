import request from '@/utils/request';
import { TableListQueryParams, TableListItem } from './data.d';

// 查询用户列表数据
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/edu/teacher/list',
    method: 'get',
    params,
  });
}

// 新增用户数据
export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: 'system/user/addUser',
    method: 'POST',
    data: params,
  });
}

// 更新用户数据
export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `system/user/editUser/${id}`,
    method: 'PUT',
    data: params,
  });
}

// 删除用户数据
export async function removeData(id: number): Promise<any> {
  return request({
    url: `system/user/delete/${id}`,
    method: 'delete'
  });
}

// 根据用户ID获取用户信息
export async function detailData(id: number): Promise<any> {
  return request({url: `system/user/getUserDetailById/${id}`});
}

// 获取所有角色数据
export async function getAllRoles(): Promise<any> {
  return request({url: `/system/user/getAllRoles`});
}
