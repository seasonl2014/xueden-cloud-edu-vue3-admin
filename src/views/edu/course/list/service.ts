import request from '@/utils/request';
import {TableListQueryParams, TableListItem, UpdateStatusParams} from './data.d';

// 查询课程列表数据
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/edu/course/list',
    method: 'get',
    params,
  });
}

// 新增课程数据
export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/edu/course/add',
    method: 'POST',
    data: params,
  });
}

// 更新课程数据
export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/edu/course/update/${id}`,
    method: 'PUT',
    data: params,
  });
}

// 删除课程数据
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/edu/course/delete/${id}`,
    method: 'delete'
  });
}

// 根据课程ID获取课程信息
export async function detailData(id: number): Promise<any> {
  return request({url: `/edu/course/edit/${id}`});
}

// 获取课程分类树形数据
export async function getParentCategoryList(): Promise<any> {
  return request({url: `/edu/subject/getParentEduSubjectTreeNode`});
}

// 获取上传视频进度
export async function getUploadPercentData(fileKey: string): Promise<any> {
  return request({url: `/edu/oss/getUploadPercent/${fileKey}`});
}

// 更新课程状态
export async function updateStatusData(params: UpdateStatusParams): Promise<any> {
  return request({
    url: `/edu/course/updateStatus/${params.id}`,
    method: 'PUT',
    data: params,
  });
}


// 下载课程资料
export async function downloadTableData(id: number): Promise<any> {
  return request({
    url: `/edu/course/download/${id}`,
    method: 'get'
  });
}
