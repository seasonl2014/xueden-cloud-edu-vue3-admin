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

export interface TableFormDataType {
  id: number;
  name?: string;
  value?: string;
  edit?: boolean;
  isNew?: boolean;
  courseId?: number;
}

export interface TableListItem {
  id: number;
  cover?: string;
  teacherId?: number;
  subjectId?: number;
  title?: string;
  shortTitle?: string;
  courseType?: number | null;
  difficulty?: number | null;
  price?: number;
  lessonNum?: number;
  subjectParentId?: number;
  cateId?: number;
  delFlag?: boolean;
  subjectSets?: any[];
  roleList?: string[];
  remarks?: string;
  courseDesc?: string;
  fileKey?: string;
  downloadLink?: string;
  environmenParams?: TableFormDataType[];

}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}

export interface UpdateStatusParams {
  id: number;
  status: string;
}
