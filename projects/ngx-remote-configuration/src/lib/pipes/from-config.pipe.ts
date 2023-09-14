import { ChangeDetectorRef, inject, OnDestroy, Pipe, PipeTransform, Type } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ConfigurationManager } from '../configuration-manager';

@Pipe({
  name: 'fromConfig',
  standalone: true,
  pure: false,
})
export class FromConfigPipe implements PipeTransform, OnDestroy {
  private readonly config = inject(ConfigurationManager);

  //This is a hack to get around the fact that the async pipe is not injectable
  private readonly asyncPipe = new AsyncPipe(inject(ChangeDetectorRef));

  public transform<T>(key: string, bindTo?: Type<T>): T | null | undefined {
    const value$ = this.config.value$<T>(key, bindTo);

    return this.asyncPipe.transform(value$);
  }

  ngOnDestroy(): void {
    this.asyncPipe.ngOnDestroy();
  }
}
