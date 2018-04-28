export const CONF_PROD = {
  production: true,
  environment: 'PROD'
};

export const environment = {
  production: true,
  socket: {
    //baseUrl: 'http://127.0.0.1:8080',
    baseUrl: 'https://signal-network.herokuapp.com',
    opts: {}
  },
  api: {
    //baseUrl: 'http://127.0.0.1:8080'
    baseUrl: 'https://signal-network.herokuapp.com'
  }
}

