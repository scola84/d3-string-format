import { format as numberFormat } from 'd3';

export default {
  format,
  match
};

function format(args, value, options) {
  for (let i = 0; i < options.length; i += 1) {
    value = value.replace(options[i],
      numberFormat(options[i].slice(2, -3))(args[i]));
  }

  return value;
}

function match(value) {
  return typeof value === 'string' &&
    value.match(/%\((.+)\)ns/gi);
}
