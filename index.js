import get from 'lodash-es/get';
import sprintf from 'sprintf-js';

let locale = null;
let stringFormat = null;

function stringFormatDefaultLocale(definition) {
  locale = stringFormatLocale(definition);
  stringFormat = locale.format;
}

function stringFormatLocale(definition) {
  return {
    format(prefix = null) {
      return (code, ...args) => {
        code = prefix ? prefix + '.' + code : code;
        return sprintf.vsprintf(get(definition, code), args);
      };
    }
  };
}

stringFormatDefaultLocale({});

export {
  stringFormat,
  stringFormatDefaultLocale,
  stringFormatLocale
};
