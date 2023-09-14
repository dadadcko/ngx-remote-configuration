import { EventEmitter } from '@angular/core';
import { IConfiguration } from '../types';
import { selectNestedValue } from './select-nested-config.operator';
import { Observable } from 'rxjs';

describe('SelectNestedConfigOperator', () => {
  let emitter: EventEmitter<IConfiguration>;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe('should map to value from config observable', () => {
    describe('when single-level key is used (no dots)', () => {
      const key = 'testKey';
      let piped: Observable<string | undefined>;

      beforeEach(() => {
        piped = emitter.pipe(selectNestedValue<string>(key));
      });

      it('with primitives', done => {
        const config = { [key]: 'testValue', otherKey: 'otherValue' };

        piped.subscribe({
          next: value => {
            expect(value).not.toBeNull();
            expect(value).not.toBeUndefined();
            expect(value).toBe(config[key]);
            done();
          },
          error: () => fail('Should not fail'),
        });

        emitter.emit(config);
      });

      it('with objects', done => {
        const nested = { nestedKey: 'nestedValue' };
        const config = { [key]: nested, otherKey: 'otherValue' };

        piped.subscribe({
          next: value => {
            expect(value).not.toBeNull();
            expect(value).not.toBeUndefined();
            expect(value).toEqual(config[key] as never);
            expect(value).toEqual(nested as never);
            done();
          },
          error: () => fail('Should not fail'),
        });

        emitter.emit(config);
      });
    });

    describe('when multi-level key is used (with dots)', () => {
      const key = 'testKey.nestedKey.thirdLevelKey';
      let piped: Observable<string | undefined>;

      beforeEach(() => {
        piped = emitter.pipe(selectNestedValue<string>(key));
      });

      it('with primitives', done => {
        const keys = key.split('.');
        const expected = 'testValue';
        const config = {
          [keys[0]]: {
            [keys[1]]: {
              [keys[2]]: expected,
            },
          },
          otherKey: 'otherValue',
        };

        piped.subscribe({
          next: value => {
            expect(value).not.toBeNull();
            expect(value).not.toBeUndefined();
            expect(value).toBe(expected);
            done();
          },
          error: () => fail('Should not fail'),
        });

        emitter.emit(config);
      });

      it('with objects', done => {
        const keys = key.split('.');
        const expected = { deepProperty: 69 };
        const config = {
          [keys[0]]: {
            [keys[1]]: {
              [keys[2]]: expected,
            },
          },
          otherKey: 'otherValue420',
        };

        piped.subscribe({
          next: value => {
            expect(value).not.toBeNull();
            expect(value).not.toBeUndefined();
            expect(value).toEqual(jasmine.objectContaining(expected));
            done();
          },
          error: () => fail('Should not fail'),
        });

        emitter.emit(config);
      });

      it('with arrays', done => {
        const keys = ['testKey', '1', 'deepProperty'];

        const piped = emitter.pipe(selectNestedValue<number>(keys.join('.')));
        const expected = 69;
        const config = {
          [keys[0]]: [{ [keys[2]]: 1 }, { [keys[2]]: expected }, { [keys[2]]: 3 }],
          otherKey: 'otherValue420',
        };

        piped.subscribe({
          next: value => {
            expect(value).not.toBeNull();
            expect(value).not.toBeUndefined();
            expect(value).toEqual(expected);
            done();
          },
          error: () => fail('Should not fail'),
        });

        emitter.emit(config);
      });
    });
  });

  describe('should map to undefined', () => {
    it('when path defined by key does not exist', done => {
      const key = 'nonExistingKey.totally.wrong';
      const piped = emitter.pipe(selectNestedValue<number>(key));

      piped.subscribe({
        next: value => {
          expect(value).toBeUndefined();
          done();
        },
        error: () => fail('Should not fail'),
      });

      emitter.emit({ testKey: 'testValue', a: { b: { c: 69 } } });
    });
  });
});
