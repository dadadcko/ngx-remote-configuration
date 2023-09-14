import { ConfigurationLoader, HttpClientConfigurationLoader } from './loader';
import { ConfigurationManager } from './configuration-manager';
import { mockClass } from '../test/auto-mock';
import { TestBed } from '@angular/core/testing';
import { of, take, throwError, toArray } from 'rxjs';

describe(ConfigurationManager.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigurationManager,
        {
          provide: ConfigurationLoader,
          useClass: mockClass(HttpClientConfigurationLoader),
        },
      ],
    });
  });

  it('should be created', () => {
    const loader = TestBed.inject(ConfigurationLoader);

    spyOn(loader, 'load').and.returnValue(of());
    const configurationManager = TestBed.inject(ConfigurationManager);

    expect(configurationManager).toBeTruthy();
  });

  describe('#configuration$ observable', () => {
    it('should emit loaded configuration', done => {
      const expected = { testKey: { testNested: 'test' } };
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(of(expected));
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager.configuration$.pipe(take(1)).subscribe({
        next: configuration => {
          expect(configuration).toEqual(expected);
          done();
        },
        error: () => fail('should not throw error'),
      });
    });

    it('should rethrow error when loader throws', done => {
      const expected = new Error('error');
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(throwError(() => expected));
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager.configuration$.pipe(take(1)).subscribe({
        next: () => fail('should not emit next'),
        error: err => {
          expect(err).toEqual(expected);
          done();
        },
      });
    });

    it('should re-emit configuration only when any property changes', done => {
      const emissions = [
        { testKey: { testNested: 'test' } },
        { testKey: { testNested: 'test' } },
        { testKey: { testNested: 'test2' } },
        { testKey: { testNested: 'test2' } },
        { testKey: { testNested: 'test2' }, newKey: 69 },
      ];
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(of(...emissions));
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager.configuration$.pipe(toArray()).subscribe({
        next: configurations => {
          expect(configurations.length).toBe(3);
          done();
        },
        error: () => fail('should not throw error'),
      });
    });
  });

  describe('#value$ method', () => {
    it('should emit value for specified key', done => {
      const expected = 'test';
      const key = 'testKey';
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(of({ [key]: expected }));
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager
        .value$(key)
        .pipe(take(1))
        .subscribe({
          next: value => {
            expect(value).toEqual(expected);
            done();
          },
          error: () => fail('should not throw error'),
        });
    });

    it('should emit undefined when key is not found', done => {
      const key = 'nonExistingKey';
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(of({ differentKey: 'test' }));
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager
        .value$(key)
        .pipe(take(1))
        .subscribe({
          next: value => {
            expect(value).toBeUndefined();
            done();
          },
          error: () => fail('should not throw error'),
        });
    });

    it('should emit undefined when key is not found in nested object', done => {
      const key = 'testKey.testNested';
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(of({ testKey: { differentKey: 'test' } }));
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager
        .value$(key)
        .pipe(take(1))
        .subscribe({
          next: value => {
            expect(value).toBeUndefined();
            done();
          },
          error: () => fail('should not throw error'),
        });
    });

    it('should emit value for nested key', done => {
      const expected = 'test';
      const key = 'testKey.testNested';
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(of({ testKey: { testNested: expected } }));
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager
        .value$(key)
        .pipe(take(1))
        .subscribe({
          next: value => {
            expect(value).toEqual(expected);
            done();
          },
          error: () => fail('should not throw error'),
        });
    });

    it('should emit value for nested array key', done => {
      const expected = 'test';
      const key = 'testKey.0.testNested';
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(of({ testKey: [{ testNested: expected }] }));
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager
        .value$(key)
        .pipe(take(1))
        .subscribe({
          next: value => {
            expect(value).toEqual(expected);
            done();
          },
          error: () => fail('should not throw error'),
        });
    });

    it('should emit value for nested array key with multiple levels', done => {
      const expected = 'test';
      const key = 'testKey.0.testNested.0.testDeep';
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(
        of({ testKey: [{ testNested: [{ testDeep: expected }] }] })
      );
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager
        .value$(key)
        .pipe(take(1))
        .subscribe({
          next: value => {
            expect(value).toEqual(expected);
            done();
          },
          error: () => fail('should not throw error'),
        });
    });

    it('should emit value for nested array key with multiple levels and multiple elements', done => {
      const expected = { testDeep: 69 };
      const key = 'testKey.0.testNested.1';
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(
        of({ testKey: [{ testNested: [{ testNested: 'test1' }, expected] }] })
      );
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager
        .value$(key)
        .pipe(take(1))
        .subscribe({
          next: value => {
            expect(value).toEqual(expected);
            done();
          },
          error: () => fail,
        });
    });

    it('should re-emit only when property specified by key or child changes', done => {
      const emissions = [
        { testKey: { testNested: 'test' } },
        { testKey: { testNested: 'test' } },
        { testKey: { testNested: 'test2' } },
        { testKey: { testNested: 'test2' } },
        { testKey: { testNested: 'test2' }, newKey: 69 },
      ];
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(of(...emissions));
      const configurationManager = TestBed.inject(ConfigurationManager);
      const key = 'testKey.testNested';

      configurationManager
        .value$(key)
        .pipe(toArray())
        .subscribe({
          next: values => {
            expect(values.length).toBe(2);
            done();
          },
          error: () => fail('should not throw error'),
        });
    });

    it('should crate class instance and bind data to it, if provided ', done => {
      class TestClass {
        constructor(public magicNumber: number) {}
      }

      const key = 'parent.testNested';
      const config = { parent: { testNested: { magicNumber: 69 } } };
      const loader = TestBed.inject(ConfigurationLoader);

      spyOn(loader, 'load').and.returnValue(of(config));
      const configurationManager = TestBed.inject(ConfigurationManager);

      configurationManager
        .value$(key, TestClass)
        .pipe(take(1))
        .subscribe({
          next: value => {
            expect(value).toBeInstanceOf(TestClass);
            expect((value as TestClass).magicNumber).toEqual(config.parent.testNested.magicNumber);
            done();
          },
          error: () => fail('should not throw error'),
        });
    });
  });
});
