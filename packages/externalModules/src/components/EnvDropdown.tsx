import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, from } from 'rxjs';
import { map, switchMap, startWith, mergeMap } from 'rxjs/operators';
import { Dropdown } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from '../helpers/dataComponentHoc';

const bootstrap = (WORKSPACE: any) => {
  return new Promise(async (resolve) => {
    interface EnvDropdownUIProps {
      items: any[];
      select: (request: { key: { envKey: 'string' } }) => void;
    }

    class EnvDropdownUI extends React.Component<EnvDropdownUIProps> {
      public render() {
        return <Dropdown title="Environments" items={this.props.items} onChange={this.handleOnChange} />;
      }

      private handleOnChange = ({ label }) => {
        this.props.select({ key: { envKey: label } });
      };
    }

    const mountPoint = 'env-dropdown';

    class EnvDropdown extends HTMLElement {
      public props$?: Observable<any>;

      constructor() {
        super();
        this.innerHTML = `<div id=${mountPoint}></div>`;
      }

      public connectedCallback() {
        const Component: any = this.props$ ? dataComponentHoc(EnvDropdownUI, this.props$) : EnvDropdownUI;
        ReactDOM.render(<Component />, document.getElementById(mountPoint));
      }
    }

    class EnvDropdownWithData extends EnvDropdown {
      public setProps() {
        this.props$ = from(WORKSPACE.services({})).pipe(
          mergeMap((services: any) => services.EnvSelectorService),
          map((envSelectorService: any) => envSelectorService.proxy),
          switchMap((envSelectorService) => {
            return envSelectorService.output$({}).pipe(
              map((envs: any[]) => envs.map((env) => ({ label: env.envKey }))),
              map((items) => ({
                items,
                select: envSelectorService.select,
              }))
            );
          }),
          startWith({
            items: [],
            select: () => {},
          })
        );
      }
    }

    resolve(EnvDropdownWithData);
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
