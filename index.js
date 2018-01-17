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
        let string = get(definition,
          prefix ? prefix + '.' + code : code);

        if (Array.isArray(string)) {
          if (typeof args[0] === 'undefined') {
            string = null;
          } else {
            args = String(args[0]).split(' ');
            string = string[args.length - 1];
          }
        } else if (typeof string === 'object') {
          string = args[0] && string[args[0].count] || string.d;
        }

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
