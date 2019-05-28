import { Observable, from } from 'rxjs';
import { mergeMap, startWith, map } from 'rxjs/operators';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
// @ts-ignore
import { RequestForm as RequestFormUI } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from '../helpers/dataComponentHoc';

const bootstrap = (WORKSPACE: any) => {
  return new Promise((resolve) => {
    const mountPoint = 'request-form';

    class RequestForm extends HTMLElement {
      public props$?: Observable<any>;

      constructor() {
        super();
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `#brace-editor { height: 250px!important; }`;
        document.body.appendChild(styleEl);
      }

      public connectedCallback() {
        const Component: React.JSXElementConstructor<any> = this.props$
          ? dataComponentHoc(RequestFormUI, this.props$ as any)
          : RequestFormUI;
        ReactDOM.render(<Component />, document.getElementById(mountPoint));
      }
    }

    class RequestFormWithData extends RequestForm {
      public setProps() {
        this.props$ = from(WORKSPACE.services({})).pipe(
          mergeMap((services: any) => from(services.MethodSelectorService)),
          mergeMap((methodSelectorService: any) => from(methodSelectorService.proxy.selected$({}))),
          // @ts-ignore
          map((selectedData: any) => ({
            selectedMethodPath:
              selectedData.serviceName && selectedData.methodName
                ? `${selectedData.serviceName}/${selectedData.methodName}`
                : '',
            content: {
              language: 'javascript',
              requestArgs: 'return {};',
            },
            onSubmit: (data) => {
              console.log('the data from RequestForm has been submitted', data);
            },
          })),
          startWith(() => ({
            selectedMethodPath: '',
            content: {
              language: 'javascript',
              requestArgs: 'return {};',
            },
            onSubmit: (data) => {
              console.log('the data from RequestForm has been submitted', data);
            },
          }))
        );
      }
    }

    resolve(RequestFormWithData);
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
