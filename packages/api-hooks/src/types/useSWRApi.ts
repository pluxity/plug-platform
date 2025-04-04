export type AllowedMethod = 'GET' | 'DELETE';

export interface UseSWRApiReturn<T> {
  data: T | null;
  error: Error | undefined;
  isLoading: boolean;
  mutate: () => void;
}
