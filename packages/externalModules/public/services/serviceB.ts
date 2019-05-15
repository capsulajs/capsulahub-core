import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

export class ServiceB {
  getRandomNumbers(name: string): Observable<number> {
    return timer(0, 1000).pipe(map(() => Math.round(Math.random() * 1000)));
  }
}
