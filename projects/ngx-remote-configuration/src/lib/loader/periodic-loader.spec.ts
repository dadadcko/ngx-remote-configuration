import { ConfigurationLoader } from './configuration-loader';
import { TestBed } from '@angular/core/testing';
import { PERIODIC_RELOAD_INTERVAL } from '../constants';
import { mockClass } from '../../test/auto-mock';
import { PeriodicConfigurationLoader } from './periodic-loader';
import { of, take, throwError, timeInterval, toArray } from 'rxjs';
import { IConfiguration } from '../types';

describe(PeriodicConfigurationLoader.name, () => {
  const reloadInterval = 0.01;
  let loader: PeriodicConfigurationLoader;
  let innerLoader: ConfigurationLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PeriodicConfigurationLoader, useClass: PeriodicConfigurationLoader },
        { provide: PERIODIC_RELOAD_INTERVAL, useValue: reloadInterval },
        { provide: ConfigurationLoader, useClass: mockClass(PeriodicConfigurationLoader) },
      ],
    });

    loader = TestBed.inject(PeriodicConfigurationLoader);
    innerLoader = TestBed.inject(ConfigurationLoader);
  });

  it('should be created', () => {
    expect(loader).toBeTruthy();
  });

  describe('#load method', () => {
    it('should re-emit values from inner loader', done => {
      const expected: IConfiguration[] = [{ test: 1 }, { test: 2 }, { test: 3 }];

      jest.spyOn(innerLoader, 'load').mockReturnValue(of(...expected));

      loader
        .load()
        .pipe(take(3), toArray())
        .subscribe({
          next: values => {
            expect(values).toEqual(expected);
            done();
          },
          error: () => fail('should not be called'),
        });
    });

    it('should rethrow error and not start periodic refresh when first load fails', done => {
      jest
        .spyOn(innerLoader, 'load')
        .mockReturnValueOnce(throwError(() => new Error('test error')));

      loader.load().subscribe({
        next: () => fail('should not be called'),
        error: error => {
          expect(error).toEqual(new Error('test error'));
          done();
        },
      });
    });

    it('should ignore errors when periodic refresh fails (not first time)', done => {
      jest.spyOn(innerLoader, 'load').mockReturnValueOnce(of({ test: 1 }));
      jest
        .spyOn(innerLoader, 'load')
        .mockReturnValueOnce(throwError(() => new Error('test error 1')));
      jest
        .spyOn(innerLoader, 'load')
        .mockReturnValueOnce(throwError(() => new Error('test error 2')));
      jest.spyOn(innerLoader, 'load').mockReturnValueOnce(of({ test: 2 }));

      loader
        .load()
        .pipe(take(2), toArray())
        .subscribe({
          next: values => {
            expect(values).toEqual([{ test: 1 }, { test: 2 }]);
            done();
          },
          error: () => fail('should not be called'),
        });
    });

    it('should reload every n seconds, based on config', done => {
      const expected: IConfiguration[] = [{ test: 1 }, { test: 2 }, { test: 3 }];

      jest.spyOn(innerLoader, 'load').mockReturnValueOnce(of(expected[0]));
      jest.spyOn(innerLoader, 'load').mockReturnValueOnce(of(expected[1]));
      jest.spyOn(innerLoader, 'load').mockReturnValueOnce(of(expected[2]));

      loader
        .load()
        .pipe(take(3), timeInterval(), toArray())
        .subscribe({
          next: values => {
            values
              .map(v => v.interval)
              .forEach((i, emission) => {
                if (emission === 0) expect(i).toBeCloseTo(0, -1);
                // -1 will do expected difference < 5 (okay for testing...)
                else expect(i).toBeCloseTo(reloadInterval * 1000, -1);
              });

            expect(values.map(v => v.value)).toEqual(expected);
            done();
          },
          error: () => fail('should not be called'),
        });
    });
  });
});
