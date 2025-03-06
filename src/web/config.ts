import { coalesce } from '@/web/helpers/utils';

export const API_PROTOCOL = coalesce(
  import.meta.env.VITE_SERVER_PROTOCOL,
  window.location.protocol.replace(':', '')
);
export const SOCKET_PROTOCOL = coalesce(import.meta.env.VITE_SOCKET_PROTOCOL, 'ws');
export const SERVER_HOST_NAME = coalesce(import.meta.env.VITE_SERVER_HOST, window.location.hostname);
export const SERVER_PORT = coalesce(import.meta.env.VITE_SERVER_PORT, '80');
export const SERVER_API_PATH = coalesce(import.meta.env.VITE_SERVER_PATH, '');
export const API_URL = `${API_PROTOCOL}://${SERVER_HOST_NAME}:${SERVER_PORT}${SERVER_API_PATH}`;
export const SOCKET_URL = `${SOCKET_PROTOCOL}://${SERVER_HOST_NAME}:${SERVER_PORT}`;
export const IS_DEV_MODE = import.meta.env.DEV;
