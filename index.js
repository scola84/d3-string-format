import { DateTime } from 'luxon';
import bytes from 'bytes';
import marked from 'marked';
import get from 'lodash-es/get';
import sprintf from 'sprintf-js';

let locale = null;
let stringFormat = null;

function stringFormatDefaultLocale(definition, name = 'en_GB') {
  locale = stringFormatLocale(definition, name);
  stringFormat = locale.format;
}

function stringFormatLocale(definition, name) {
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

        const byte = value && value.match(/%by/g);

        if (byte) {
          value = formatBytes(args, value, byte);
        }

        const md = value && value.match(/%md/g);

        if (md) {
          value = formatMarkdown(args, value, md);
        }

        const date = value && value.match(/%\(([a-z ]*)+\)ds/gi);

        if (date) {
          value = formatDate(args, value, date, name);
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

function formatMarkdown(args, value, md) {
  for (let i = 0; i < md.length; i += 1) {
    value = value.replace(md[i], marked(args[0], {
      breaks: true,
      sanitize: true
    }));
  }

  return value;
}

function formatDate(args, value, date, name) {
  let format = null;
  let offset = null;
  let sign = null;
  let time = null;

  for (let i = 0; i < date.length; i += 1) {
    format = date[i].slice(2, -3);

    if (!args[i]) {
      value = value.replace(date[i], '');
      continue;
    }

    [, time, sign, offset] = String(args[i])
      .match(/(\d*)([-+]?)(\d*)/);

    sign = sign || '+';
    time = Number(time);
    offset = offset || 0;

    value = value.replace(date[i], DateTime
      .fromMillis(time, { zone: 'UTC' + sign + (offset / 3600) })
      .setLocale(name.replace('_', '-'))
      .toFormat(format));
  }

  return value;
}

stringFormatDefaultLocale({});

export {
  stringFormat,
  stringFormatDefaultLocale,
  stringFormatLocale
};
