export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
  message: string;
}