import { ChangeDetectorRef, inject, OnDestroy, Pipe, PipeTransform, Type } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ConfigurationManager } from '../configuration-manager';
import { EMPTY, Observable } from 'rxjs';

@Pipe({
  name: 'fromConfig',
  standalone: true,
  pure: false,
})
export class FromConfigPipe implements PipeTransform, OnDestroy {
  private readonly config = inject(ConfigurationManager);

  //This is a hack to get around the fact that the async pipe is not injectable
  private readonly asyncPipe = new AsyncPipe(inject(ChangeDetectorRef));

  // internal state
  private readonly _state = {
    lastKey: undefined as string | undefined,
    lastBindTo: undefined as Type<unknown> | undefined,
    streamCache: Observable<never>,
  };

  public transform<T>(key: string, bindTo?: Type<T>): T | null | undefined {
    if (this._state.lastKey !== key || this._state.lastBindTo !== bindTo) {
      this._state.lastKey = key;
      this._state.lastBindTo = bindTo;
      this._state.streamCache = this.config.value$<T>(key, bindTo) as never;
    }

    return this.asyncPipe.transform(this._state.streamCache as unknown as Observable<T>);
  }

  ngOnDestroy(): void {
    this.asyncPipe.ngOnDestroy();
    this._state.streamCache = EMPTY as never;
  }
}
