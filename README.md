# capsulahub-core
This repository contains the core services of [CapsulaHub](https://github.com/capsulajs/capsula-hub).


## Services

| method                     | description                                           |
| -------------------------- | ----------------------------------------------------- |
| `packages/workspace`       | Main core service of CapsulaHub                       |
| `packages/renderer`        | Responsible for rendering the CapsulaHub components   |
| `packages/orchestrator`    | Responsible for enabling flows between services       |

### Workspace service
`packages/workspace`
https://github.com/capsulajs/capsulahub-core/blob/develop/packages/workspace/README.md

 Workspace is the main core service of Capsula Hub, it is responsible for :
 - Loading services and components according to its configuration
 - Allowing services to register themselves
 - Letting services and components communicate together
 - Exposing to the services their configuration

### Renderer service
`packages/renderer`

TBD
### Orchestrator service
`packages/orchestrator`

TBD

## Contribute

Fork this repo and open a PR.

## Licence

All core services of CapsulaHub are released under MIT Licence.
