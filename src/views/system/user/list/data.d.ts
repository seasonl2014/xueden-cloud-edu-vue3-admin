export interface TableListQueryParams {
  page: number;
  per: number;
}

export interface PaginationConfig {
  total: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

export interface TableListItem {
  id: number;
  loginName: string;
  nickName: string;
  tel: string;
  email: string;
  delFlag?: boolean;
  roleSets?: string[];
  roleList?: string[];
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}
