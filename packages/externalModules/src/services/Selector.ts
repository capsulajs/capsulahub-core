import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

interface SelectorInterface<T extends K, K> {
  input(inputRequest: InputRequest<T>): Promise<void>;
  output$(outputRequest: OutputRequest): Observable<T[]>;
  select(selectRequest: SelectRequest<K>): Promise<T>;
  selected$(selectedRequest: SelectedRequest): Observable<T>;
}

interface InputRequest<T> {
  data: Observable<T[]>;
}

interface OutputRequest {}

interface SelectRequest<K> {
  key: K;
}

interface SelectedRequest {}

export class Selector<T extends K, K> implements SelectorInterface<T, K> {
  private readonly data$: BehaviorSubject<T[]>;
  private readonly selectedSubject$: BehaviorSubject<T>;

  constructor() {
    this.selectedSubject$ = new BehaviorSubject<T>({} as T);
    this.data$ = new BehaviorSubject<T[]>([]);
  }

  public async input(inputRequest: InputRequest<T>): Promise<void> {
    return new Promise((resolve, reject) => {
      inputRequest.data.subscribe({
        next: (item) => {
          console.log('received item', item);
          this.data$.next(item);
          resolve();
        },
        error: (error) => reject(new Error(error)),
      });
    });
  }

  public output$(): Observable<T[]> {
    return this.data$;
  }

  public select(selectRequest: SelectRequest<K>): Promise<T> {
    const requestKeys = Object.keys(selectRequest.key);

    return new Promise((resolve) => {
      this.data$
        .pipe(
          take(1),
          tap((items) => {
            console.log('items in SELECT', items);
          }),
          map((items) =>
            items.find((item, index) => {
              const itemKeys = Object.keys(item);
              console.log('itemKeys', itemKeys);
              return requestKeys.every((requestKey) =>
                itemKeys.some((itemKey) => {
                  console.log('itemKey requestKey', itemKey, requestKey);
                  console.log('itemKey.includes(requestKey)', itemKey.includes(requestKey));
                  console.log('items[index][itemKey]', items[index][itemKey]);
                  console.log('selectRequest.key', selectRequest.key);
                  console.log('selectRequest.key[requestKey]', selectRequest.key[requestKey]);
                  return itemKey.includes(requestKey) && items[index][itemKey] === selectRequest.key[requestKey];
                })
              );
            })
          )
        )
        .subscribe((item) => {
          console.log('SELECT', item);
          this.selectedSubject$.next(item as T);
          resolve();
        });
    });
  }

  public selected$(): Observable<T> {
    return this.selectedSubject$;
  }
}
