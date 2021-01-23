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
  cover?: string;
  teacherId?: number;
  subjectId?: number;
  title: string;
  shortTitle: string;
  courseType?: number;
  difficulty?: number;
  price?: number;
  lessonNum?: number;
  subjectParentId?: number;
  cateId?: number;
  delFlag?: boolean;
  roleSets?: string[];
  roleList?: string[];
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}
