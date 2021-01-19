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
  username: string;
  title: string;
  href: string;
  type: string;
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}
