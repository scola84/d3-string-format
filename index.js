import bytes from 'bytes';
import { format as numberFormat } from 'd3';
import { DateTime } from 'luxon';
import get from 'lodash-es/get';
import marked from 'marked';
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
        let value = get(definition,
          prefix ? prefix + '.' + code : code);

        if (Array.isArray(value)) {
          args = String(args[0]).split(' ');
          value = value[args.length - 1];
        } else if (typeof value === 'object') {
          value = args[0] && (value[args[0]] ||
            value[args[0].count] || value.v) || value.d;
        } else if (typeof value === 'function') {
          value = value(...args);
        }

        const byte = typeof value === 'string' &&
          value.match(/%by/g);

        if (byte) {
          value = formatBytes(args, value, byte);
        }

        const md = typeof value === 'string' &&
          value.match(/%md/g);

        if (md) {
          value = formatMarkdown(args, value, md);
        }

        const number = typeof value === 'string' &&
          value.match(/%\((.+)\)ns/gi);

        if (number) {
          value = formatNumber(args, value, number);
        }

        const date = typeof value === 'string' &&
          value.match(/%\(([a-z ]*)+\)ds/gi);

        if (date) {
          value = formatDate(args, value, date, definition.name);
        }

        return typeof value === 'string' ?
          sprintf.vsprintf(value, args) :
          value;
      };
    }
  };
}

function formatBytes(args, value, byte) {
  for (let i = 0; i < byte.length; i += 1) {
    value = value.replace(byte[i], bytes(args[i]));
  }

  return value;
}

function formatDate(args, value, date, name) {
  const zone = (args.length - date.length) === 1 ?
    args[args.length - 1] : null;

  for (let i = 0; i < date.length; i += 1) {
    if (!args[i]) {
      value = value.replace(date[i], '');
      continue;
    }

    value = value.replace(date[i], DateTime
      .fromMillis(Number(args[i]))
      .setZone(zone)
      .setLocale(name.replace('_', '-'))
      .toFormat(date[i].slice(2, -3)));
  }

  return value;
}

function formatMarkdown(args, value, md) {
  for (let i = 0; i < md.length; i += 1) {
    value = value.replace(md[i], marked(args[0], {
      breaks: true,
      sanitize: true
    }));
  }

  return value;
}

function formatNumber(args, value, number) {
  for (let i = 0; i < number.length; i += 1) {
    value = value.replace(number[i],
      numberFormat(number[i].slice(2, -3))(args[i]));
  }

  return value;
}

stringFormatDefaultLocale({});

export {
  stringFormat,
  stringFormatDefaultLocale,
  stringFormatLocale
};
