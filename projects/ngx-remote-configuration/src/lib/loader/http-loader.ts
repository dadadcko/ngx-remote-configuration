import { inject, Injectable } from '@angular/core';
import { IConfiguration } from '../types';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CONFIG_URL } from '../constants';
import { ConfigurationLoader } from './configuration-loader';

@Injectable()
export class HttpClientConfigurationLoader implements ConfigurationLoader {
  private readonly httpClient = inject(HttpClient);

  private readonly configUrl: string = inject(CONFIG_URL);

  public load(): Observable<IConfiguration> {
    return this.httpClient.get<IConfiguration>(this.configUrl);
  }
}
