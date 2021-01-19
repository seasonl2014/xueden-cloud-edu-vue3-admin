import { TableListItem as HotSearchTableListItem } from './components/MapChartCard/data.d';
import { TableListItem as HotTagsTableListItem } from './components/HotTagsCard/data.d';
import { TableListItem as ArticleHitTableListItem } from './components/UserChartCard/data.d';
import { TableListItem as WorksHitTableListItem } from './components/WorksHitCard/data.d';

export interface ChartDataType {
  day: string[];
  num: number[];
}

export interface UserChartDataType {
  count: number;
}

export interface RoleChartDataType {
  count: number;
}

export interface MenuChartDataType {
  count: number;
}

export interface LogsChartDataType {
  count: number;
}

export interface LinksChartDataType {
  chart: ChartDataType;
}

export interface MapChartDataType {
  pv: object[];
}
