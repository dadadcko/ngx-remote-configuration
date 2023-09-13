import {inject, Injectable} from "@angular/core";
import {ConfigurationLoader} from "./loader";
import {IConfiguration} from "./types";
import {distinctUntilChanged, Observable, shareReplay} from "rxjs";


// TODO: implement better deep equal
function isDeepStrictEqual<T>(p: T, c: T): boolean {
  return JSON.stringify(p) === JSON.stringify(c);
}

/**
 * Configuration manager
 *
 */
@Injectable()
export class ConfigurationManager {
  private readonly loader = inject(ConfigurationLoader);

  // actual configuration stream
  private readonly _configStream = this.loader
    .load()
    .pipe(distinctUntilChanged(isDeepStrictEqual)) // emit only when configuration changes
    .pipe(shareReplay(1)); // share same configuration stream to all subscribers

  /**
   * Stream of current configuration.
   *
   * Emits new configuration each time new value is available.
   * @remarks This method returns untyped configuration object, containing any possible value.
   * Use {@link bindSection$} to bind configuration section to class instance and get type support.
   */
  public get configuration$(): Observable<IConfiguration> {
    return this._configStream;
  }

  // public bindSection$<T extends {}>(Section: Type<T>, sectionName: string): Observable<T> {
  //
  //   return this.configuration$
  //     .pipe(
  //       pluck(sectionName),
  //       distinctUntilChanged(isDeepStrictEqual),
  //       map((section: T) => Object.assign(new Section(), section))
  //     );
  // }
}

