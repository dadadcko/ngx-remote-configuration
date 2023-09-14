# Demo app for Ngx Remote Configuration

This app is a showcase of features of the NgxRemoteConfiguration library.

## Run the sample

To run the sample, first build the library:

```bash
npm run build
```

Then, run the sample:

```bash
npm run start-demo
```

## Features

Sample includes the following features:

- [x] Loading configuration from a remote source
- [x] Resilient configuration loading
- [x] Periodic Configuration reloading
- [x] Configuration section binding
- [x] Configuration section binding to actual class instances
- [x] Custom pipe, which extends `AsyncPipe`, for easy configuration usage in templates
