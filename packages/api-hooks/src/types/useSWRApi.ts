import { KeyedMutator } from "swr";
import { DataResponseBody } from "./response";

export type AllowedMethod = 'GET' | 'DELETE';

export interface UseSWRApiReturn<T> {
  data: T | null ;
  error: Error | null;
  isLoading: boolean;
  mutate: KeyedMutator<DataResponseBody<T> | null>;
  refresh: () => Promise<DataResponseBody<T> | null | undefined>;
}