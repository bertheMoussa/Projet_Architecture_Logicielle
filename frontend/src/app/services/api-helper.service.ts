import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
const base_url: string = 'http://localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class ApiHelperService {
  private readonly base_url: string = base_url;

  constructor(private http: HttpClient) {}

  public get({
    endpoint,
    queryParams = {},
  }: {
    endpoint: string;
    queryParams?: any;
  }): Observable<any> {
    return this.request({ endpoint, method: 'GET', queryParams });
  }

  public post({
    endpoint,
    data = {},
    queryParams = {},
  }: {
    endpoint: string;
    data?: any;
    queryParams?: any;
  }): Observable<any> {
    return this.request({ endpoint, method: 'POST', data, queryParams });
  }

  public put({
    endpoint,
    data = {},
    queryParams = {},
  }: {
    endpoint: string;
    data?: any;
    queryParams?: any;
  }): Observable<any> {
    return this.request({ endpoint, method: 'PUT', data, queryParams });
  }

  public delete({
    endpoint,
    data = {},
    queryParams = {},
  }: {
    endpoint: string;
    data?: any;
    queryParams?: any;
  }): Observable<any> {
    return this.request({ endpoint, method: 'DELETE', data, queryParams });
  }

  public request({
    endpoint,
    method = 'GET',
    data = {},
    queryParams = {},
  }: {
    endpoint: string;
    method?: string;
    data?: object;
    queryParams?: any;
  }): Observable<any> {
    const methodWanted = method.toLowerCase();
    const url = this.base_url + endpoint;

    const requestOptions = {
      params: queryParams,
    };

    console.log(method, url, JSON.stringify(requestOptions), JSON.stringify(data));

    let req: Observable<HttpResponse<any>>;

    if (methodWanted === 'get') {
      req = this.http.get(url, { ...requestOptions, observe: 'response' });
    } else if (methodWanted === 'post') {
      req = this.http.post(url, data, {
        ...requestOptions,
        observe: 'response',
      });
    } else if (methodWanted === 'put') {
      req = this.http.put(url, data, {
        ...requestOptions,
        observe: 'response',
      });
    } else {
      req = this.http.delete(url, { ...requestOptions, observe: 'response' });
    }

    if (!req) {
      throw new Error(`error calling ${url} with method ${methodWanted}`);
    }

    return req.pipe(
      map((res) => {
        return res.body;
      })
    );
  }
}
