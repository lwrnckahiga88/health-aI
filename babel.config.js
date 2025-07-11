module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
        "targets": {
          "browsers": [
            "> 0.5%",
            "last 2 versions",
            "not dead"
          ]
        }
      }
    ],
    "@babel/preset-react"
  ]
};