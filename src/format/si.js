import {
  format as numberFormat,
  formatPrefix
} from 'd3';

export default {
  format,
  match,
  mode: {
    NUMBER: 2 ** 0,
    UNIT: 2 ** 1
  },
  specifier: {
    FLOAT: '.3s',
    INTEGER: '.0s'
  }
};

function format(args, value, options) {
  let unit = null;
  let mode = null;
  let number = null;
  let prefix = null;
  let replace = null;
  let specifier = null;

  for (let i = 0; i < options.length; i += 1) {
    [
      unit,
      mode = 3,
      specifier = '.3s',
      prefix = null
    ] = options[i].slice(2, -3).split('|');

    mode = Number(mode);

    number = prefix !== null ?
      formatPrefix(specifier, prefix)(args[i]) :
      numberFormat(specifier)(args[i]);

    [, number, prefix = ''] = number.match(/([^a-z]+)([a-z]*)/i);

    replace = '';
    replace += (mode & 1) ? number : '';
    replace += ' ';
    replace += (mode & 2) ? prefix + unit : '';

    value = value.replace(options[i], replace.trim());
  }

  return value;
}

function match(value) {
  return typeof value === 'string' &&
    value.match(/%\((.+)\)si/gi);
}
