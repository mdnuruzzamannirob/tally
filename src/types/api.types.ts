export interface ApiMeta {
  requestId?: string;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiFailure {
  success: false;
  message: string;
  error: { code: string; details?: Record<string, string[]>; stack?: string };
  meta: { requestId: string };
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export function isApiFailure<T>(response: ApiEnvelope<T>): response is ApiFailure {
  return !response.success;
}

export type ApiErrorShape = {
  status?: number | string;
  data?: ApiFailure;
  error?: string;
};
