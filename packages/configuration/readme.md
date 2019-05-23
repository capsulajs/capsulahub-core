# Configuration

Possible providers:
  - HardcoreRemoteProvider
  - LocalStorageProvider
  - FileProvider
  - HttpProvider

Default provider:
  - FileProvider

Possible dispatchers [More](https://github.com/capsulajs/capsulajs-transport-providers):
  - AxiosDispatcher
  - WebSocketDispatcher

Getting started:
```
import { Workspace } from '@capsulajs/capsulahub-core-workspace/src/api';
import { ConfigurationConfig } from '@capsulajs/capsulajs-extention-configuration/src/api';

const workspace: Workspace = ...;
const config: ConfigurationConfig = {
  token: 'sometoken',
  provider: 'local'
};

const configurationService = await bootstrap(workspace, config);
await configService.createRepository({ repository: 'testRepo' });
await configService.save({ repository: 'testRepo', key: 'foo', value: 'bar' });
await configService.entries({ repository: 'testRepo' }) #=> { entries: [{ key: 'foo', value: 'bar' }] };
```
