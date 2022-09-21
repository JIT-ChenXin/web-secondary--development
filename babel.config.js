module.exports = api => {
  // This caches the Babel config
  // const isDevelopment = process.env.NODE_ENV !== 'production';
  api.cache.using(() => process.env.NODE_ENV);

  const contextPlugin = [];

  if (process.env.NODE_ENV === 'test') {
    contextPlugin.push('require-context-hook');
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry',
          corejs: { version: 3, proposals: true },
          targets: {
            browsers: ['last 2 versions', 'safari >= 7', 'ie >= 11'],
          },
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      'emotion',
      'lodash',
      [
        'babel-plugin-react-scoped-css',
        {
          include: '.scoped.less$',
        },
      ],
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
      [
        '@babel/plugin-proposal-class-properties',
        {
          loose: true,
        },
      ],
      // ['import', { libraryName: 'antd', style: true }, 'antd'],
      ['import', { libraryName: 'antd-mobile', style: true }, 'antd-mobile'],
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-syntax-dynamic-import',
      "@babel/plugin-transform-modules-commonjs"
      // isDevelopment &&
      //   process.env.NOREFRESH !== 'true' &&
      //   require.resolve('react-refresh/babel'),
    ]
      .filter(Boolean)
      .concat(contextPlugin),
  };
};
