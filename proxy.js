module.exports = {
  '/api': {
    'target': 'http://10.15.111.9:13042/',
    'changeOrigin': true,
    'pathRewrite': { '^/api': '' },
  },
}
