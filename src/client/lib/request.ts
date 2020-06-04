import axios, { AxiosRequestConfig } from 'axios';

type Parameter = string | number | boolean;

type Parameters = {
  [key: string]: Parameter;
};

export async function api(method: 'post' | 'get', url: string, params: Parameters) {
  const option: AxiosRequestConfig = {
    validateStatus: () => true,
  };

  const result = await (() => {
    if (method === 'post') {
      option.headers = { 'content-type': 'application/x-www-form-urlencoded' };
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`, [])
        .join('&');
      return axios.post(url, queryString, option);
    } else {
      option.params = Object.keys(params).reduce((acc, key) => {
        const param = params[key];
        acc[key] = param.toString();
        return acc;
      }, {} as Parameters);
      return axios.get(url, option);
    }
  })();
  return result.data;
}
