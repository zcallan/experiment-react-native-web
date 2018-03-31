module.exports = {
  getTransformModulePath() {
    return require.resolve( './transformer.js' );
  },
  getSourceExts() {
    return ['css', 'scss'];
  },
};
