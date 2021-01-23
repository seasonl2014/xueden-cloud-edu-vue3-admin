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

// 新增讲师数据
export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/edu/teacher/add',
    method: 'POST',
    data: params,
  });
}

// 更新用户数据
export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/edu/teacher/update/${id}`,
    method: 'PUT',
    data: params,
  });
}

// 删除用户数据
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/edu/teacher/delete/${id}`,
    method: 'delete'
  });
}

// 根据用户ID获取需要编辑的讲师信息
export async function detailData(id: number): Promise<any> {
  return request({url: `/edu/teacher/edit/${id}`});
}

// 获取所有角色数据
export async function getAllRoles(): Promise<any> {
  return request({url: `/system/user/getAllRoles`});
}

// 获取所有讲师数据
export async function getAllTeacherList(): Promise<any> {
  return request({url: `/edu/teacher/all`});
}
