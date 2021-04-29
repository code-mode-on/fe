import {
  configureHttpRequest,
  post,
} from './apiHelpers';
import { loadState } from '../store/browserStorage';

export function apiGetSession(email, password) {
  configureHttpRequest();
  return post('api/auth/login', { email, password });
}

export function apiGetAuthEntity(email) {
  configureHttpRequest();
  return post('api/auth/auth-entity', { email });
}

export function apiRefreshApiToken() {
  configureHttpRequest();
  const auth = loadState('auth');
  const refreshToken = (auth && auth.session && auth.session.refreshToken) || '';
  return post('api/auth/refresh-token', { refreshToken });
}

export function apiLogoutUser() {
  const { userId, envList, serviceKey } = configureHttpRequest();
  return post('api/auth/logout', { userId, envList, serviceKey });
}

export function apiRegisterUser(registarationData) {
  configureHttpRequest();
  return post('api/registration/completeregistration', registarationData);
}

export function apiCheckEmailExists(email) {
  configureHttpRequest();
  return post('api/registration/checkemailexists', { email });
}

export function apiCheckRegistrationTokenExists(token) {
  configureHttpRequest();
  return post('api/registration/checktokenexists', { token });
}

export function apiResetPassword(email) {
  return post('api/auth/resetpassword', { email });
}

export function apiCheckTokenExists(token) {
  return post('api/auth/checktokenexists', { token });
}

export function apiSaveNewPassword(token, password) {
  return post('api/auth/savenewpassword', { token, password });
}
export function apiGetUserNavData(serviceKey, preSelectUrl) {
  const { userId, envList } = configureHttpRequest();
  return post('api/user/navs', { userId, envList, serviceKey, preSelectUrl });
}

export function apiExchangeThirdPartyAuthToken(authObj) {
  configureHttpRequest();
  return post('api/auth/exchange-token', { ...authObj });
}

export default {
  apiGetSession,
  apiLogoutUser,
  apiRegisterUser,
  apiCheckEmailExists,
  apiGetUserNavData,
  apiGetAuthEntity,
  apiExchangeThirdPartyAuthToken,
  apiRefreshApiToken,
};
