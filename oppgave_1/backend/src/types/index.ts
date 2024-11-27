export type PaginationMetadata = {
  total: number;
  pageSize: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type Success<T> = {
  success: true;
  data: T;
} & Partial<PaginationMetadata>;

export type Failure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type Result<T> = Success<T> | Failure;
