module.exports = {
  development: {
    username: 'vagrant',
    password: 'vagrant',
    database: 'graph_algo_dev',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: 'vagrant',
    password: 'vagrant',
    database: 'graph_algo_test',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
  production: {
    username: 'vagrant',
    password: 'vagrant',
    database: 'graph_algo_prod',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  }
}
