import '@babel/polyfill';
import { WorkspaceFactory } from '../es/src/WorkspaceFactory';

const workspaceFactory = new WorkspaceFactory();
workspaceFactory
  .createWorkspace({ token: 'localhost:3000/configuration' })
  .then((workspace) => {
    return workspace.services({});
  })
  .then((services) => {
    console.log('services', services);
    return services.ServiceA;
  })
  .then((serviceA) => {
    return serviceA.proxy.greet('Stephane');
  })
  .then((greeting) => {
    console.log('greeting', greeting);
  });
