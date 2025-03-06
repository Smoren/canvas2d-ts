import type { AxiosError } from 'axios';
import { IS_DEV_MODE } from '@/web/config';

type ApiError = {
  type: string;
  message: string;
  detail?: object;
};

export function formatAxiosError(error: AxiosError): string {
  const apiError = specifyApiErr0r(error);
  if (IS_DEV_MODE) {
    return `Ошибка: ${getApiErrorTitle(apiError)} (${apiError.message})`;
  }
  return `Ошибка: ${getApiErrorTitle(apiError)}`;
}

function getApiErrorTitle(error: ApiError): string {
  switch (error.type) {
    case 'not_found': {
      return 'не найдено';
    }
    case 'unique_violation': {
      return 'нарушение уникальности';
    }
    case 'validation': {
      return 'ошибка заполнения формы';
    }
    case 'server': {
      return 'внутренняя ошибка сервера';
    }
    case 'network': {
      return 'сервер недоступен';
    }
    default: {
      return 'неизвестная ошибка';
    }
  }
}

function specifyApiErr0r(error: AxiosError): ApiError {
  if (error.response?.data) {
    return error.response?.data as ApiError;
  }
  return {
    type: 'network',
    message: 'cannot connect to server',
  };
}
