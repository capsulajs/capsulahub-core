import bootstrap from '../../src';
import {
  ConfigurationServiceHardcoreRemote,
  ConfigurationServiceLocalStorage,
  ConfigurationServiceFile,
  ConfigurationServiceHttp,
} from '@capsulajs/capsulajs-configuration-service/lib';
import { AxiosDispatcher } from '@capsulajs/capsulajs-transport-providers';

test('Test default configuration', async () => {
  const mock = jest.fn();
  // @ts-ignore
  const workspace = { registerService: mock };
  const config = { token: 'test' };
  // @ts-ignore
  mock.mockResolvedValueOnce({});
  // @ts-ignore
  await bootstrap(workspace, config);
  expect(mock.mock.calls[0][0].reference).toBeInstanceOf(ConfigurationServiceFile);
});

test('Test remote configuration', async () => {
  const mock = jest.fn();
  // @ts-ignore
  const workspace = { registerService: mock };
  const config = {
    token: 'test',
    provider: 'remote',
    dispatcher: new AxiosDispatcher('/test'),
  };
  mock.mockResolvedValueOnce({});
  // @ts-ignore
  await bootstrap(workspace, config);
  expect(mock.mock.calls[0][0].reference).toBeInstanceOf(ConfigurationServiceHardcoreRemote);
});

test('Test local configuration', async () => {
  const mock = jest.fn();
  // @ts-ignore
  const workspace = { registerService: mock };
  const config = { token: 'test', provider: 'local' };
  mock.mockResolvedValueOnce({});
  // @ts-ignore
  await bootstrap(workspace, config);
  expect(mock.mock.calls[0][0].reference).toBeInstanceOf(ConfigurationServiceLocalStorage);
});

test('Test file configuration', async () => {
  const mock = jest.fn();
  // @ts-ignore
  const workspace = { registerService: mock };
  const config = { token: 'test', provider: 'file' };
  mock.mockResolvedValueOnce({});
  // @ts-ignore
  await bootstrap(workspace, config);
  expect(mock.mock.calls[0][0].reference).toBeInstanceOf(ConfigurationServiceFile);
});

test('Test http configuration', async () => {
  const mock = jest.fn();
  // @ts-ignore
  const workspace = { registerService: mock };
  const config = { token: 'test', provider: 'http' };
  mock.mockResolvedValueOnce({});
  // @ts-ignore
  await bootstrap(workspace, config);
  expect(mock.mock.calls[0][0].reference).toBeInstanceOf(ConfigurationServiceHttp);
});
