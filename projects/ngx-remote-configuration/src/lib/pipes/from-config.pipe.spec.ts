import { FromConfigPipe } from './from-config.pipe';
import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ConfigurationManager } from '../configuration-manager';
import { mockClass } from '../../test/auto-mock';

describe(FromConfigPipe.name, () => {
  let pipe: FromConfigPipe;
  let config: ConfigurationManager;
  const key = 'test.key';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FromConfigPipe],
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: { markForCheck: jest.fn(), detectChanges: jest.fn() },
        },
        { provide: ConfigurationManager, useClass: mockClass(ConfigurationManager) },
      ],
    });

    pipe = TestBed.runInInjectionContext(() => new FromConfigPipe());
    config = TestBed.inject(ConfigurationManager);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('#transform method', () => {
    const testValue = {};
    let emitter: EventEmitter<unknown>;

    beforeEach(() => {
      emitter = new EventEmitter();
      jest.spyOn(config, 'value$').mockReturnValue(emitter.asObservable());
    });

    it('should return null when subscribing to an observable', () => {
      expect(pipe.transform(key)).toBe(null);
    });

    it('should return the latest config value', done => {
      pipe.transform(key);
      emitter.emit(testValue);

      setTimeout(() => {
        expect(pipe.transform(key)).toEqual(testValue);
        done();
      }, 0);
    });

    it('should return same value when nothing has changed since the last call', done => {
      pipe.transform(key);
      emitter.emit(testValue);

      setTimeout(() => {
        pipe.transform(key);
        expect(pipe.transform(key)).toBe(testValue);
        done();
      }, 0);
    });
  });
});
