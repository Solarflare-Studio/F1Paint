const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {

    optimization: {
        minimize: false
      },

    module: {
        rules: [
            {
                test: /\.js$/,
                /* ... */
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: false }
                    }
                ]
            },
            {
                test: /\.php$/,
                use: [
                    {
                        loader: "php-loader",
                        options: { minimize: false }
                    }
                ]
              },
            
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/sfPaint.html",
            filename: "./F1PaintShop.html",
            minify: false,
            minifyJS: false
        }),
    ]
}