import get from 'lodash-es/get';
import sprintf from 'sprintf-js';
import formatter from './format/';

export default function format(definition) {
  return (prefix = null) => {
    return (code, ...args) => {
      let value = get(definition, prefix ? prefix + '.' + code : code);

      if (Array.isArray(value)) {
        args = String(args[0]).split(' ');
        value = value[args.length - 1];
      } else if (typeof value === 'object') {
        value = args[0] === 'object' ? value :
          args[0] &&
          (get(value, args[0]) || value[args[0].count] || value.v) ||
          value.d;
      } else if (typeof value === 'function') {
        value = value(...args, args);
      }

      const keys = Object.keys(formatter);

      let item = null;
      let match = null;

      for (let i = 0; i < keys.length; i += 1) {
        item = formatter[keys[i]];
        match = item.match(value);

        if (match) {
          value = item.format(args, value, match);
        }
      }

      try {
        value = typeof value === 'string' ?
          sprintf.vsprintf(value, args) :
          value;
      } catch (error) {
        value = error.message;
      }

      return value;
    };
  };
}
