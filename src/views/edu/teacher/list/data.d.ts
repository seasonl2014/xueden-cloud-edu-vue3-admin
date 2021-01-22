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
  level: number;
  name: string;
  sort: number;
  intro: string;
  avatar?: string;
  delFlag?: boolean;
  remarks?: string;
  roleSets?: string[];
  roleList?: string[];
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}
