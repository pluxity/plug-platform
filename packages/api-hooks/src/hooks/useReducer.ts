import { ApiAction, ApiState } from "../types/useReducer";

export function apiReducer<T = any>(state: ApiState<T>, action: ApiAction<T>): ApiState<T> {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
        isSuccess: false,
        data: null,
        response: null
      };
    case 'SUCCESS':
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        data: action.data,
        response: action.response || null
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        error: action.error,
      };
    case 'RESET':
      return {
        data: null,
        error: null,
        isLoading: false,
        isSuccess: false,
        response: null
      };
    default:
      return state;
  }
}