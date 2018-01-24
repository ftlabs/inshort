# FT Labs - inshort

Base project containing the barebones files to get started with SAPI requests and FT SSO.
## Installation

### Configure env params

either as env vars or in a local .env file

* CAPI_KEY=...

### Install the dependencies

```sh
$ npm install
```

Sumy, a python library, is also required for extractive summary. To install this on your system, you can use pip.
To install pip (Python package manager) on a mac, you can use 'easy_install pip' and then run:

```sh
pip install sumy
```

### Start the server.

The server will watch for any changes made and automatically restart.

```sh
$ npm start
```


### For tests, run:

```sh
$ npm test
```
