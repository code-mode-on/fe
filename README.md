import { loadState } from '../store/browserStorage';
import axios from 'axios';
import getBaseUrl from './baseUrl';
import { reduceToKeyValuePairs } from 'Utils/dataUtils';

const baseUrl = getBaseUrl();

export function configureHttpRequest() {
  const auth = loadState('auth');
  const userPrefs = loadState('userPrefs');
  const drillParams = loadState('drillParams') && reduceToKeyValuePairs(loadState('drillParams'));
  const sessionToken = (auth && auth.session && auth.session.authToken) || '';
  const serviceKey = userPrefs && userPrefs.serviceKey || '';

  axios.defaults.headers.common.Accept = 'text/csv,application/pdf,application/json';
  axios.defaults.headers.common.Authorization = `Bearer ${sessionToken}`;
  axios.defaults.timeout = __XHR_API_TIMEOUT_SEC__;
  return { userId: getUserIdFromBrowser(auth), envList: getEnvListFromBrowser(auth), drillParams, serviceKey };
}

export function getUserIdFromBrowser(auth) {
  return (auth && auth.session && auth.session.userId) || '';
}

export function getEnvListFromBrowser(auth) {
  return (auth && auth.session && auth.session.envList) || '';
}

export function isLanguageSupported(langCode) {
  const supportedLanguages = [
    'en-US',
    'en-GB',
  ];
  const langPosition = supportedLanguages.indexOf(langCode);
  return langPosition > -1;
}

export default {
  configureHttpRequest,
  isLanguageSupported,
  getUserIdFromBrowser,
};

export function getQueryStringParameterByName(name, url) {
  const urlToParse = url || window.location.href;
  const encodedName = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line
  const regex = new RegExp(`[?&]${encodedName}(=([^&#]*)|&|#|$)`);

  const results = regex.exec(urlToParse);
  if (!results) return null;

  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


export function get(url) {
  return axios.get(`${baseUrl}${url}`)
    .then(onSuccess)
    .catch(onError);
}

export function getWithHost(url) {
  return axios.get(url)
    .then(onSuccess)
    .catch(onError);
}

export function post(url, body) {
  return axios({
    method: 'post',
    url: `${baseUrl}${url}`,
    data: body,
  }).then(onSuccess)
    .catch(onError);
}

export function postBlob(url, body) {
  return axios({
    method: 'post',
    url: `${baseUrl}${url}`,
    data: body,
    responseType: 'blob',
  })
    .then(onBlobSuccess)
    .catch(onError);
}

function onBlobSuccess(response) {

  if (response.status !== 204) {
    const fileName = response.headers['content-disposition'] ? response.headers['content-disposition'].split(';')[1].trim().split('=')[1] : undefined;
    return { file: response.data, fileName };
  }
  throw 'No Response Content';
}


function onSuccess(response) {

  if (response.status !== 204) {
    return response.data;
  }
  throw 'No Response Content';
}

function onError(error) {

  if (error && error.code === 'ECONNABORTED') {
    throw {
      status: 504,
      data: {
        variant: 'error',
        message: 'Server Timeout while API operation.',
      },
    };
  }

  const returnedError = error && error.response;
  throw returnedError;
}

