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
  name: string;
  vipMoney: number;
  courseTypeSets?: string[];
  courseTypeList?: object[];
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}
