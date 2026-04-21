export default {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 16,
      propList: ["*"], // convert all
      unitPrecision: 5, // round to 5 decimal places instead of scientific notation
      mediaQuery: true,
      exclude: /node_modules/i,
      selectorBlackList: ["rounded-full"], // Ignore any class with 'rounded-full'
    },
  },
};
