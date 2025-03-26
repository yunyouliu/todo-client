declare namespace API {
    interface PaginatedResponse<T> {
      code: number;
      data: T;
      total: number;
      page: number;
      pageSize: number;
    }
  }