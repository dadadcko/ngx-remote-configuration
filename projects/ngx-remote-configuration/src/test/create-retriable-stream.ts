import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs';

// Create retriable observable stream to test retry / retryWhen. Credits to:
// https://stackoverflow.com/questions/51399819/how-to-create-a-mock-observable-to-test-http-rxjs-retry-retrywhen-in-angular
export const createRetriableStream = (...resp$: Observable<unknown>[]): Observable<unknown> => {
  const fetchData = jest.fn();

  resp$.forEach(resp => fetchData.mockReturnValueOnce(resp));

  return of(null).pipe(switchMap(_ => fetchData()));
};
