import { ResilientConfigurationLoader } from './resilient-loader';
import { TestBed } from '@angular/core/testing';
import { LOADER_RETRY_CONFIG } from '../constants';
import { ConfigurationLoader } from './configuration-loader';
import { mockClass } from '../../test/auto-mock';
import { IConfiguration } from '../types';
import { EventEmitter } from '@angular/core';
import { Observable, of, throwError, toArray } from 'rxjs';
import { createRetriableStream } from '../../test/create-retriable-stream';
import arrayWithExactContents = jasmine.arrayWithExactContents;

describe(ResilientConfigurationLoader.name, () => {
  const testConfig = { retryCount: 3, retryDelay: 0 };
  let loader: ResilientConfigurationLoader;
  let innerLoader: ConfigurationLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ResilientConfigurationLoader, useClass: ResilientConfigurationLoader },
        { provide: LOADER_RETRY_CONFIG, useValue: testConfig },
        { provide: ConfigurationLoader, useClass: mockClass(ResilientConfigurationLoader) },
      ],
    });

    loader = TestBed.inject(ResilientConfigurationLoader);
    innerLoader = TestBed.inject(ConfigurationLoader);
  });

  it('should be created', () => {
    expect(loader).toBeTruthy();
  });

  describe('#load method', () => {
    describe('when no retry is needed', () => {
      it('should re-emit values from inner loader', done => {
        const emitter = new EventEmitter();
        const expected = ['test', 'test2', 'test3'];

        spyOn(innerLoader, 'load').and.returnValue(emitter);

        loader
          .load()
          .pipe(toArray())
          .subscribe({
            next: values => {
              expect(values).toEqual(arrayWithExactContents(expected));
              done();
            },
            error: () => fail('should not be called'),
          });

        emitter.emit(expected[0]);
        emitter.emit(expected[1]);
        emitter.emit(expected[2]);
        emitter.complete();
      });
    });

    describe('when retry is needed - inner observable throws', () => {
      it('should retry', done => {
        const expected = { key: 'test' };

        spyOn(innerLoader, 'load').and.returnValue(
          createRetriableStream(
            throwError(() => 'err'),
            of(expected)
          ) as Observable<IConfiguration>
        );

        loader.load().subscribe({
          next: value => {
            expect(value).toEqual(expected);
            done();
          },
          error: () => fail('should not fail, retry should be successful'),
        });
      });

      it('should fail after n retries', done => {
        const errors = Array.from({ length: testConfig.retryCount + 1 }, (_, i) =>
          throwError(() => `err ${i + 1}`)
        );

        spyOn(innerLoader, 'load').and.returnValue(
          createRetriableStream(...errors, of('wontEvenGetHere')) as Observable<IConfiguration>
        );

        loader.load().subscribe({
          next: () => fail('should not be called'),
          error: err => {
            expect(err).toEqual(`err ${errors.length}`);
            done();
          },
        });
      });
    });
  });
});
