export const CONF_LOCAL = {
  production: false,
  environment: 'LOCAL'
};

export const environment = {
  production: false,
  socket: {
    baseUrl: 'https://signal-network.herokuapp.com',
    //baseUrl: 'http://127.0.0.1:8080',
    opts: {}
  },
  api: {
    //baseUrl: 'http://127.0.0.1:8080'
    baseUrl: 'https://signal-network.herokuapp.com'
  }
}

