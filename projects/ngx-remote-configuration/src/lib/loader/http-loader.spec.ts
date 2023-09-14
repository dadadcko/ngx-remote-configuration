import { HttpClientConfigurationLoader } from './http-loader';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CONFIG_URL } from '../constants';
import { provideHttpClient } from '@angular/common/http';

describe(HttpClientConfigurationLoader.name, () => {
  const testingConfigUrl = 'http://localhost:8080/config.json';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CONFIG_URL, useValue: testingConfigUrl },
        HttpClientConfigurationLoader,
      ],
    });
  });

  it('should be created', () => {
    const loader = TestBed.inject(HttpClientConfigurationLoader);

    expect(loader).toBeTruthy();
  });

  it('should get config URL from injection token', () => {
    const loader = TestBed.inject(HttpClientConfigurationLoader);

    expect(loader['configUrl']).toBe(testingConfigUrl);
  });

  describe('#load method', () => {
    let httpTestingController: HttpTestingController;
    let loader: HttpClientConfigurationLoader;

    beforeEach(() => {
      httpTestingController = TestBed.inject(HttpTestingController);
      loader = TestBed.inject(HttpClientConfigurationLoader);
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should load configuration from URL when called', done => {
      const expectedConfig = { test: 'test', nyes: { nyes2: 'no' } };

      loader.load().subscribe(c => {
        expect(c).toBe(expectedConfig);
        done();
      });

      const req = httpTestingController.expectOne(testingConfigUrl);

      // Respond with mock data, causing Observable to resolve.
      // Subscribe callback asserts that correct data was returned.
      req.flush(expectedConfig);
    });

    it('should throw when error occurred while fetching config', done => {
      const errorMsg = 'Whoops, config could not be found, 404';

      loader.load().subscribe({
        next: () => fail('Should not be called'),
        error: err => {
          expect(err.status).toEqual(404);
          expect(err.statusText).toEqual('Not Found');
          done();
        },
      });

      const req = httpTestingController.expectOne(testingConfigUrl);

      req.flush(errorMsg, { status: 404, statusText: 'Not Found' });
    });
  });
});
