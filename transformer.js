const upstreamTransformer = require('metro/src/transformer');
const sassTransformer = require('react-native-sass-transformer');
const cssTransformer = require('react-native-css-transformer');

module.exports.transform = function({ src, filename, options }) {
  if (filename.endsWith(".scss")) {
    return sassTransformer.transform({ src, filename, options });
  } else if (filename.endsWith(".css")) {
    return cssTransformer.transform({ src, filename, options });
  } else {
    return upstreamTransformer.transform({ src, filename, options });
  }
};
