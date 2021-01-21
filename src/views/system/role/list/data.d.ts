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
  remarks: string;
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}

export interface MenusDataType {
  menusList: [];
  menuIds: string[];
}

export interface RoleMenusDataItem {
  roleId: number;
  menuIds: string[];
}
