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
        let string = prefix ? prefix + '.' + code : code;

        string = get(definition, string);
        string = args[0] &&
          typeof args[0].count !== 'undefined' &&
          typeof string !== 'undefined' ?
          string[args[0].count] || string.d : string;

        return sprintf.vsprintf(string, args);
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
