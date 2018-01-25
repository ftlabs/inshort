# FT Labs - nshort


The main purpose of this repo is to demonstate extractive summarisation of articles. The UI provides a basic interface to test
out the different summarisation algorithms.

WARNING:
This is a bunch of different experiments surrounding summaries. 
Each experiment had a very short development period, without a defined end goal, therefore the code is not meant for production and contains mostly prototyped concepts that were never finished or planned out, this is meant as a resource for ideas and experiments.

### Installation

Install the dependencies and start the server. The server will watch for any changes made and automatically restart.

```sh
$ npm install
$ npm start
```

In another tab run 
```sh
$ npm run client-dev
```

Sumy, a python library, is also required for extractive summary. To install this on your system, you can use pip. 
To install pip (Python package manager) on a mac, you can use 'easy_install pip' and then run:

```sh
pip install sumy
```

For tests, run:

```sh
$ npm test
```

### Configuration

Inshort requires the following env params:

CAPI_KEY=... # to allow access to the Content and Search APIs
TOKEN=... # to allow the APIs to be used from outside the FT network and SSO
PORT=... # auto-set by Heroku, but needs to be set manually when run from cmd line
