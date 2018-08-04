const path = require('path');
module.exports = {
  entry: './main.js',
  output: {
    path:   path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  devServer:{
    inline: true,
    port:3333
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};