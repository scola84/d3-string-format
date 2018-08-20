import get from 'lodash-es/get';

export default function gets(definition) {
  return (prefix = null) => {
    return (code) => {
      return get(definition, prefix ? prefix + '.' + code : code);
    };
  };
}
