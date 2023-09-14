import { EventEmitter } from '@angular/core';
import { Observable, toArray } from 'rxjs';
import { distinctUntilChangedDeepEqualOperator } from './distinct-until-changed-deep-equal.operator';

describe('distinctUntilChangedDeepEqual', () => {
  let emitter: EventEmitter<unknown>;
  let piped: Observable<unknown>;

  // generic check function
  function _check(emissions: unknown[], expectedCount: number, done: DoneFn): void {
    piped.pipe(toArray()).subscribe({
      next: values => {
        expect(values.length).toBe(expectedCount);
        done();
      },
      error: () => fail('Should not fail'),
    });

    emissions.forEach(value => emitter.emit(value));
    emitter.complete();
  }

  beforeEach(() => {
    emitter = new EventEmitter();
    piped = emitter.pipe(distinctUntilChangedDeepEqualOperator());
  });

  describe('should filter source observable when deep equality changes', () => {
    describe('with primitives', () => {
      it('-> string', done => {
        const emissions = ['test', 'test', 'test', 'test2', 'test2', 'test'];

        _check(emissions, 3, done);
      });

      it('-> number', done => {
        const emissions = [2, 2, 6, 9, 6, 6, 6];

        _check(emissions, 4, done);
      });

      it('-> null and undefined', done => {
        const emissions = [null, null, undefined, undefined, null, undefined];

        _check(emissions, 4, done);
      });

      it('-> mixed types', done => {
        const emissions = ['test', 'test', null, null, 3, 3, 3];

        _check(emissions, 3, done);
      });
    });

    describe('with objects and arrays', () => {
      it('-> objects only', done => {
        const emissions = [{ a: 6 }, { a: 6 }, { a: 9 }, { a: 6, b: 3 }, { a: 6 }, { a: 6 }];

        _check(emissions, 4, done);
      });

      it('-> nested objects', done => {
        const emissions = [
          { a: 6, b: { c: 'hey', d: 69 } },
          { a: 6, b: { c: 'hey', d: 69 } },
          { a: 6, b: { c: 'hey', d: 420 } },
          { a: 6, b: null },
          { a: 6, b: { c: 'hey2', d: 420 } },
          { a: 6, b: { c: 'hey', d: 420 } },
        ];

        _check(emissions, 5, done);
      });

      it('-> arrays', done => {
        const emissions = [
          { a: 6, b: [1, 2, 3] },
          { a: 6, b: [1, 2, 3] },
          { a: 6, b: null },
          { a: 6, b: [1, 2] },
          { a: 6, b: [1, 4] },
          { a: 6, b: [1, 4, 5] },
          { a: 6, b: [1, 4, 5] },
        ];

        _check(emissions, 5, done);
      });

      it('-> arrays with nested objects', done => {
        const emissions = [
          { a: 6, b: [{ a: 'hey' }, { b: 'hey' }, { c: 'hey' }] },
          { a: 6, b: [{ a: 'hey' }, { b: 'hey' }, { c: 'hey' }] },
          { a: 6, b: [{ a: 'hey' }, { b: null }, { c: 'hey' }] },
          { a: 6, b: [{ a: 'hey' }, {}, { c: 'hey' }] },
          { a: 6, b: [{ a: 'hey' }, { b: 'a' }, { c: 'hey' }] },
          { a: 6, b: [{ a: 'hey' }, { b: 'a' }, { c: 'hey' }] },
        ];

        _check(emissions, 4, done);
      });
    });
  });
});
