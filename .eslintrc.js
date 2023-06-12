module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // 如果你使用的是 Vue 3
  ],
  rules: {
    'no-console': 'off',
  },
};
