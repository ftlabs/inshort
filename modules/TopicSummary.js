const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly'); 
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE'))? process.env.CAPI_CONCURRENCE : 4;
const LOG_STYLES = require('../helpers/pretty-log');
const ArticleSummary = require('./ArticleSummary');
const util = require('../helpers/util');
