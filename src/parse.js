import get from 'lodash-es/get';

export default function parse(definition) {
  return (prefix = null) => {
    return (base, value = '') => {
      const object = get(definition, prefix ? prefix + '.' + base : base);
      return findKey(object, '', (v) => {
        return String(v).toLowerCase() === String(value).toLowerCase();
      });
    };
  };
}

function findKey(object, pre, cb) {
  const keys = Object.keys(object);

  let found = null;
  let full = null;
  let key = null;

  for (let i = 0; i < keys.length; i += 1) {
    key = keys[i];
    full = [pre, key].filter((v) => v).join('.');

    if (typeof object[key] === 'object') {
      found = findKey(object[key], full, cb);
    } else {
      found = cb(object[key]) ? full : null;
    }

    if (found) {
      return found;
    }
  }

  return object[-1];
}
