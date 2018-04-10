export default {
  "presets": ["babel-preset-expo"],
  "env": {
    "development": {
      "plugins": [
        "transform-react-jsx-source",
        "react-native-classname-to-style",
        [
          "react-native-platform-specific-extensions",
          {
            "extensions": ["css", "scss"]
          }
        ],
        "react-native-classname-to-dynamic-style",
        // ["react-css-modules", {
        //   context: path.resolve(__dirname, 'src'),
        //   generateScopedName: '[path][local]_[hash:base64:4]',
        //   exclude: 'node_modules',
        // }]
      ]
    }
  }
}
