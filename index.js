import format from './src/format';
import get from './src/get';
import parse from './src/parse';
import formatters from './src/format/';

let locale = null;
let getString = null;
let stringFormat = null;
let stringParse = null;

function stringFormatDefaultLocale(definition) {
  locale = stringFormatLocale(definition);
  getString = locale.get;
  stringFormat = locale.format;
  stringParse = locale.parse;
}

function stringFormatLocale(definition) {
  return {
    format: format(definition),
    get: get(definition),
    parse: parse(definition)
  };
}

stringFormatDefaultLocale({});

export {
  formatters,
  getString,
  stringFormat,
  stringFormatDefaultLocale,
  stringFormatLocale,
  stringParse
};
