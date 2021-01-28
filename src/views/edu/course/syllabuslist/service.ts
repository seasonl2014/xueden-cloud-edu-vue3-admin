import request from '@/utils/request';
import { TableListQueryParams, TableListItem } from './data.d';

export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/edu/chapter/chapterTree',
    method: 'get',
    params,
  });
}

export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/edu/chapter/add',
    method: 'POST',
    data: params,
  });
}

export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/edu/chapter/update/${id}`,
    method: 'PUT',
    data: params,
  });
}

export async function removeData(id: number): Promise<any> {
  return request({
    url: `/edu/chapter/delete/${id}`,
    method: 'delete',
  });
}

export async function detailData(id: number): Promise<any> {
  return request({url: `/edu/chapter/edit/${id}`});
}
// 获取阿里云视频点播凭证
export async function getPlayAuthData(id: string): Promise<any> {
  return request({url: `/edu/vod/getPlayAuth/${id}`});
}

// 新增课程小节数据
export async function createVideoTableData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/edu/video/add',
    method: 'POST',
    data: params,
  });
}

// 删除课程小节
export async function removeVideoData(id: number): Promise<any> {
  return request({
    url: `/edu/video/delete/${id}`,
    method: 'delete',
  });
}

// 获取课程小节数据
export async function detailVideoData(id: number): Promise<any> {
  return request({url: `/edu/video/edit/${id}`});
}

// 更新课程小节
export async function updateVideoData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/edu/video/update/${id}`,
    method: 'PUT',
    data: params,
  });
}

// 获取上传视频进度
export async function getUploadPercentData(id: string): Promise<any> {
  return request({url: `/edu/vod/getUploadPercent/${id}`});
}
