import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, from } from 'rxjs';
import { map, switchMap, startWith, mergeMap } from 'rxjs/operators';
import { Catalog } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from '../helpers/dataComponentHoc';
import { mapServiceMethods } from '../helpers/mapServiceMethods';

const bootstrap = (WORKSPACE: any) => {
  return new Promise(async (resolve) => {
    interface MethodCatalogProps {
      methods: any[];
      selectMethod: (args: any) => void;
    }

    interface MethodCatalogState {
      selectedMethod?: object;
    }

    class MethodCatalogUI extends React.Component<MethodCatalogProps, MethodCatalogState> {
      public state = {
        selectedMethod: undefined,
      };

      public render() {
        const { selectedMethod } = this.state;
        const { methods } = this.props;

        if (methods.length === 0) {
          return 'No services ..';
        }

        return (
          <Catalog
            methods={mapServiceMethods(methods)}
            selectedMethod={selectedMethod}
            selectMethod={this.handleOnChange}
          />
        );
      }

      private handleOnChange = (selectedMethod) => {
        this.props.selectMethod(selectedMethod);
        this.setState({ selectedMethod });
      };
    }

    const mountPoint = 'web-method-catalog';

    class MethodCatalog extends HTMLElement {
      public props$?: Observable<any>;

      constructor() {
        super();
        this.innerHTML = `<div id=${mountPoint}></div>`;
      }

      public connectedCallback() {
        const Component: any = this.props$ ? dataComponentHoc(MethodCatalogUI, this.props$) : MethodCatalogUI;
        ReactDOM.render(<Component />, document.getElementById(mountPoint));
      }
    }

    class CatalogWithData extends MethodCatalog {
      public setProps() {
        this.props$ = from(WORKSPACE.services({})).pipe(
          mergeMap((services: any) => from(services.MethodSelectorService)),
          map((serviceData: any) => serviceData.proxy),
          switchMap((methodSelectorService) => {
            return methodSelectorService.output$({}).pipe(
              // @ts-ignore
              map((methods) => ({
                methods,
                selectMethod: (selectedMethod) =>
                  methodSelectorService.select({ key: { methodName: selectedMethod.name } }),
              }))
            );
          }),
          startWith({
            methods: [],
            selectedMethod: () => {},
          })
        );
      }
    }

    resolve(CatalogWithData);
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;