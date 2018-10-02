import marked from 'marked';

export default {
  format,
  match
};

function format(args, value, options) {
  for (let i = 0; i < options.length; i += 1) {
    value = value.replace(options[i], marked(args[0], {
      breaks: true,
      sanitize: true
    }));
  }

  return value.replace(/%/g, '%%');
}

function match(value) {
  return typeof value === 'string' &&
    value.match(/%md/g);
}
