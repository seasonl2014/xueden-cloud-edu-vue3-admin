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
  svgIcon: string;
  component?: string;
  componentName?: string;
  path: string;
  isMenu: string;
  sort?: number;
  disShow?: number;
  parentId?: number | string ;
  permission?: string;
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}

export interface MenuTableDataType {
  menuList: TableListItem[];
}

export interface MenuTreeDataType {
  value: number | string;
  label: string;
  children?: any[];
}

export interface LeftAndTopMenuTreeDataType {
  children?: any[];
  icon: string;
  title: string;
  path: string;
  redirect?: string;
  component?: Component | Promise<Component>;

}

