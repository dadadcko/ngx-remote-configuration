import {Observable} from "rxjs";
import {IConfiguration} from "../types";
import {Injectable} from "@angular/core";

/**
 * Configuration loader
 * Used to load configuration from remote source
 */
@Injectable()
export abstract class ConfigurationLoader {

  /**
   * Load configuration from remote source
   * @returns {Observable<IConfiguration>} Observable with configuration,
   * which emits every time configuration is loaded,
   * based on loader implementation
   */
  public abstract load(): Observable<IConfiguration>;
}
