import request from '@/utils/request';
import { TableListQueryParams, TableListItem } from './data.d';

// 查询课程分类列表数据
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/edu/subject/categoryTree',
    method: 'get',
    params,
  });
}

// 新增课程分类数据
export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: 'edu/subject/add',
    method: 'POST',
    data: params,
  });
}

// 更新课程分类数据
export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `edu/subject/update/${id}`,
    method: 'PUT',
    data: params,
  });
}

// 删除课程分类数据
export async function removeData(id: number): Promise<any> {
  return request({
    url: `edu/subject/delete/${id}`,
    method: 'delete'
  });
}

// 根据用户ID获取课程分类信息
export async function detailData(id: number): Promise<any> {
  return request({url: `edu/subject/edit/${id}`});
}

// 获取课程分类树形数据
export async function getParentCategoryList(): Promise<any> {
  return request({url: `/edu/subject/getParentEduSubjectTreeNode`});
}
