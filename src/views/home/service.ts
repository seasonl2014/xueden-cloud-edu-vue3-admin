import request from '@/utils/request';


export async function dailynewUsers(): Promise<any> {
  return request({
      url: '/system/user/list',
      method: 'get'
  });
}

export async function dailynewRole(): Promise<any> {
  return request({
      url: '/system/role/list',
      method: 'post'
  });
}

export async function dailynewMenu(): Promise<any> {
  return request({
      url: '/system/menu/list',
      method: 'get'
  });
}

export async function dailynewLogs(): Promise<any> {
    return request({
        url: '/system/log/list',
        method: 'post'
    });
}

export async function annualnewLinks(): Promise<any> {
  return request({
      url: '/system/log/pvs',
      method: 'get'
  });
}

export async function pvprovinceQueryList(): Promise<any> {
  return request({
    url: '/system/log/pvprovince',
    method: 'get'
  });
}



