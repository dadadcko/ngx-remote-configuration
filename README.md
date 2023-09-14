# 🚀 Ngx Remote Configuration

![Build Status](https://github.com/dadadcko/ngx-remote-configuration/actions/workflows/ci.yml/badge.svg?branch=main)
![npm](https://img.shields.io/npm/v/ngx-remote-configuration)
![npm](https://img.shields.io/npm/dm/ngx-remote-configuration)
![GitHub](https://img.shields.io/github/license/dadadcko/ngx-remote-configuration)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)



Utility library for managing remote configuration in Angular applications.

Configuration is loaded from remote URL and accessible via simple configuration facade.

## Samples
The best way to find out, what library can offer to you, is by exploring the examples.
There is a [demo app](https://github.com/dadadcko/ngx-remote-configuration/tree/main/projects/demo-app) prepared, which showcases all features of this library.

## 🔧 Instalation

To install the package, simply run following command at path, where your `package.json` is located:
```bash
npm install ngx-remote-configuration
```

Then, register library providers:
```ts
// register the remote configuration providers
provideRemoteConfiguration(...);
```

## Usage
Public Api of the library is represented by single `ConfigurationManager` facade.
This facade provides stream with latest configuration object from remote source.
Sample usage of the facade:
```ts
// full configuration
inject(ConfigurationManager)
    .configuration$.subscribe(config => console.log('Full configuration:', config));

// some value/ section
inject(ConfigurationManager)
      .value$<string>('nestedObj.secondProp')
      .subscribe(value => console.log('Configuration value under <nestedObj.secondProp> :', value));

// section bound to a class instance
inject(ConfigurationManager)
      .value$<NestedConfigurationSection>('nestedObj', NestedConfigurationSection)
      .subscribe(value =>
        console.log('Configuration value under <nestedObj>, bound to class instance :', value)
      );
```

For detailed usage preview, check out [demo sample app](https://github.com/dadadcko/ngx-remote-configuration/tree/main/projects/demo-app).

## Add-ins
Library provides several add-ins features, which can modify/enrich the default behaviour.

Example of some Add-ins:
- **Resilient configuration loading**: Adds resiliency when loading configuration from remote source.
Enabled by calling `withResilientConfigurationLoader(retryOptions)` when registering providers.
- **Periodic configuration reloads**: Adds periodic reloads of configuration. Consumers are notified _only_ when configuration value changes.
Enabled by calling `withPeriodicReloads(intervalInSeconds)` when registering providers.
- **On bootstrap load**: By default, configuration is loaded when it is requested for the first time.
This add-in opposes this default behaviour, and loads configuration before application starts - blocking the startup until configuration is resolved.
Enabled by calling `withLoadOnApplicationBootstrap()` when registering providers.

For the full list of features, check [provider registration in demo sample app](https://github.com/dadadcko/ngx-remote-configuration/blob/main/projects/demo-app/src/app/app.config.ts).
