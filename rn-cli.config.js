module.exports = {
  getTransformModulePath() {
    return require.resolve( './transformer' );
  },
  getSourceExts() {
    return ['css', 'scss'];
  },
};
