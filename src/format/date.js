import { DateTime } from 'luxon';

export default {
  format,
  match
};

function format(args, value, options) {
  const zone = (args.length - options.length) === 1 ?
    args[args.length - 1] : 'local';

  for (let i = 0; i < options.length; i += 1) {
    if (!args[i]) {
      value = value.replace(options[i], '');
      continue;
    }

    value = value.replace(options[i], DateTime
      .fromMillis(Number(args[i]))
      .setZone(zone)
      .setLocale(name.replace('_', '-'))
      .toFormat(options[i].slice(2, -3)));
  }

  return value;
}

function match(value) {
  return typeof value === 'string' &&
    value.match(/%\(([a-z ]*)+\)ds/gi);
}
