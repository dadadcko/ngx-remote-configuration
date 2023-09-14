import { Observable, of, switchMap } from 'rxjs';

// Create retriable observable stream to test retry / retryWhen. Credits to:
// https://stackoverflow.com/questions/51399819/how-to-create-a-mock-observable-to-test-http-rxjs-retry-retrywhen-in-angular
export const createRetriableStream = (...resp$: Observable<unknown>[]): Observable<unknown> => {
  const fetchData: jasmine.Spy = jasmine.createSpy('fetchData');

  fetchData.and.returnValues(...resp$);

  return of(null).pipe(switchMap(_ => fetchData()));
};
