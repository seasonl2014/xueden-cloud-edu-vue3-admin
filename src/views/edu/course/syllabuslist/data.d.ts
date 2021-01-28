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
  title: string;
  sort: number;
  courseId: number;
  isFree?: number;
  chapterId?: number;
  fileKey?: string;
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}
