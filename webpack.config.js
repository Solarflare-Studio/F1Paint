const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
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
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.php$/,
                use: [
                    {
                        loader: "php-loader",
                    }
                ]
              },
            
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/sfPaint.html",
            filename: "./F1PaintShop.html"
        }),
    ]
}