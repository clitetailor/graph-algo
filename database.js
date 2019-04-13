module.exports = {
  development: {
    username: 'vagrant',
    password: 'vagrant',
    database: 'graph_algo_dev',
    logging: false,
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: 'vagrant',
    password: 'vagrant',
    database: 'graph_algo_test',
    logging: false,
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
  production: {
    username: 'vagrant',
    password: 'vagrant',
    database: 'graph_algo_prod',
    logging: false,
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  }
}
