import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, from, combineLatest, merge } from 'rxjs';
import { map, switchMap, distinctUntilChanged, mergeMap, scan } from 'rxjs/operators';
import { Logger } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from '../helpers/dataComponentHoc';
import { LoggerEvent } from '../services/types';
import { isEqual } from 'lodash';

const bootstrap = (WORKSPACE: any) => {
  return new Promise(async (resolve) => {
    const mountPoint = 'logger';

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
        this.props$ = from(WORKSPACE.services({})).pipe(
          mergeMap((services: any) => {
            return combineLatest(from(services.EnvSelectorService), from(services.MethodSelectorService));
          }),
          map((servicesData: any) => servicesData.map((serviceData: any) => serviceData.proxy)),
          switchMap(([envSelectorService, methodSelectorService]) => {
            return merge(
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
              methodSelectorService.selected$({}).pipe(
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
              )
            ).pipe(
              scan((logs: any, log) => {
                return [...logs, log];
              }, []),
              map((logs) => ({
                width: 600,
                height: 400,
                logs,
              }))
            );
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
