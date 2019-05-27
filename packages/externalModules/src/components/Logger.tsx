import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, of, from, combineLatest } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Logger } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from '../helpers/dataComponentHoc';
import { LoggerEvent } from '../services/types';
import { isEqual } from 'lodash';

const bootstrap = (WORKSPACE: any) => {
  return new Promise(async (resolve) => {
    const mountPoint = 'web-logger';

    class Logs extends HTMLElement {
      public props$?: Observable<any>;

      constructor() {
        super();
        this.innerHTML = `<div id=${mountPoint}></div>`;
      }

      public connectedCallback() {
        const Component: any = this.props$ ? dataComponentHoc(Logger, this.props$) : Logger;
        ReactDOM.render(<Component />, document.getElementById(mountPoint));
      }
    }

    class LogsWithData extends Logs {
      public setProps() {
        this.props$ = combineLatest(
          from(WORKSPACE.services({}).EnvSelectorService),
          from(WORKSPACE.services({}).MethodSelectorService)
        ).pipe(
          map((servicesData: any) => servicesData.map((serviceData: any) => serviceData.proxy)),
          switchMap(([envSelectorService, methodSelectorService]) => {
            if (envSelectorService && methodSelectorService) {
              return of({
                width: 600,
                height: 400,
                logs: [
                  envSelectorService.selected$({}).pipe(
                    distinctUntilChanged(isEqual),
                    map(
                      (response): LoggerEvent => ({
                        request: {},
                        response,
                        correlationId: 'EnvSelectorService',
                        type: 'response',
                        serviceName: 'EnvSelectorService',
                        methodName: 'selected$',
                        timestamp: new Date().getTime(),
                      })
                    )
                  ),
                  methodSelectorService.output$({}).pipe(
                    distinctUntilChanged(isEqual),
                    map(
                      (response): LoggerEvent => ({
                        request: {},
                        response,
                        correlationId: 'MethodSelectorService',
                        type: 'response',
                        serviceName: 'MethodSelectorService',
                        methodName: 'output$',
                        timestamp: new Date().getTime(),
                      })
                    )
                  ),
                ],
              });
            }

            return of({
              width: 600,
              height: 400,
              logs: [],
            });
          })
        );
      }
    }

    resolve(LogsWithData);
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
