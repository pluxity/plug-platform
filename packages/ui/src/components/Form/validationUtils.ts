// validationUtils.ts
import { FormValues, ValidationErrors } from './useForm';

export const required = (value: any, message = '이 필드는 필수입니다') => {
  if (value === undefined || value === null || value === '') {
    return message;
  }
  return '';
};

export const email = (value: string, message = '올바른 이메일 형식이 아닙니다') => {
  if (!value) return '';
  
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(value) ? '' : message;
};

export const minLength = (min: number, message?: string) => {
  return (value: string) => {
    if (!value) return '';
    
    return value.length >= min ? '' : (message || `최소 ${min}자 이상 입력해주세요`);
  };
};

export const maxLength = (max: number, message?: string) => {
  return (value: string) => {
    if (!value) return '';
    
    return value.length <= max ? '' : (message || `최대 ${max}자까지 입력 가능합니다`);
  };
};

// 여러 유효성 검증 함수를 조합하여 사용할 수 있는 유틸리티 함수
export const composeValidators = (
  validators: Array<(value: any) => string>,
  value: any
) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }
  return '';
};

// 폼 유효성 검증 함수 생성 헬퍼
export const createValidator = (validationRules: Record<string, Array<(value: any) => string>>) => {
  return (values: FormValues): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    Object.entries(validationRules).forEach(([fieldName, validators]) => {
      const error = composeValidators(validators, values[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    });
    
    return errors;
  };
};
