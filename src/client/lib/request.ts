import axios, { AxiosRequestConfig } from 'axios';

type Parameter = string | number | null | boolean;
type ArrayOrSingle<T> = T | T[];

type Parameters = {
  [key: string]: ArrayOrSingle<Parameter | Parameters>;
};

export async function api(method: 'post' | 'get', url: string, params: Parameters) {
  const option: AxiosRequestConfig = {
    validateStatus: () => true,
  };

  const result = await (() => {
    if (method === 'post') {
      return axios.post(url, params, option);
    } else {
      option.params = Object.keys(params).reduce((acc, key) => {
        const param = params[key];
        if (typeof param !== 'object') {
          acc[key] = param;
        } else if (Array.isArray(param)) {
          acc[key] = param.filter(x => typeof x !== 'object');
        }
        return acc;
      }, {} as Parameters);
      return axios.get(url, option);
    }
  })();
  return result.data;
}
