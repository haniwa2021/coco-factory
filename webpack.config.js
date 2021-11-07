const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// production モード以外の場合、変数 enabledSourceMap は true
const enabledSourceMap = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    main: "./src/js/main.js",
    sub: "./src/js/sub.js",
  },
  devtool: "source-map",
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
    assetModuleFilename: "images/[hash][ext]",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: enabledSourceMap,
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: enabledSourceMap,
              postcssOptions: {
                plugins: [
                  [
                    "css-declaration-sorter",
                    {
                      order: "smacss",
                    },
                  ],
                  ["postcss-sort-media-queries", { sort: "mobile-first" }],
                  "autoprefixer",
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: require(`fibers`),
              },
              sourceMap: enabledSourceMap,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg|eot|wof|woff|ttf)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
        // use: [
        // {
        //   //画像を出力フォルダーにコピーするローダー
        //   loader: "file-loader",
        //   options: {
        //     // 画像ファイルの名前とパスの設定
        //     name: "[name].[ext]",
        //     outputPath: "images",
        //     // publicPath: "./images",
        //   },
        // },
        // ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      // cleanStaleWebpackAssets: false,
    }),
    new MiniCssExtractPlugin({
      filename: "./css/[name].css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
  },
};
