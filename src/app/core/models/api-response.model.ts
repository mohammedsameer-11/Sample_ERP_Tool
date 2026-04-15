/**
 * ARCHITECTURAL DECISION: Generic API Response Envelope
 *
 * In real enterprise apps, .NET Core controllers return a consistent
 * ApiResponse<T> wrapper rather than raw data. This serves several purposes:
 * 1. Carries pagination metadata (totalCount, page, pageSize) separate from data
 * 2. Provides a place for top-level error messages
 * 3. Allows interceptors to handle errors uniformly
 *
 * By typing our mock service responses with this exact shape, any future
 * switch to a real HTTP backend requires ZERO changes in the components
 * that consume these services.
 */
export interface ApiResponse<T> {
  data: T;
  totalCount: number;
  page: number;
  pageSize: number;
  message?: string;
  success?: boolean;
}

/** Utility type for paginated list endpoints */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalPages: number;
}

/** Standard query params matching .NET [FromQuery] binding conventions */
export interface PagedQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}