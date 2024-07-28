class Vmess {
  constructor(params) {
    this.common = {
      name: params.ps,
      type: 'vmess',
      server: params.add,
      port: params.port,
      uuid: params.id,
      alterId: params.aid,
      cipher: 'auto'
    }
  }
}

class VmessWS extends Vmess {
  constructor(params, host) {
    super(params)
    this.common = Object.assign({}, this.common, {
      udp: true,
      tls: params.tls === 'tls',
      network: 'ws',
      'ws-opts': {
        path: params.path || '/',
        headers: {
          Host: host
        }
      }
    })
  }
}

class VmessHTTP extends Vmess {
  constructor(params, host) {
    super(params);
    const method = params.method || 'GET'; // Define a default method
    this.common = {
      ...this.common,
      udp: true,
      tls: params.tls === 'tls',
      network: 'http',
      'http-opts': {
        path: params.path || '/',
        headers: {
          Host: host,
          method: method
        }
      }
    };
  }
}

function template(params, host) {
  let result = null
  switch (params.net) {
    case 'ws':
      result = new VmessWS(params, host)
      break
    case 'http':
      result = new VmessHTTP(params, host)
      break
    default:
      result = new Vmess(params)
  }
  return result.common
}

function proxies(subArr, namelists, host) {
  return [...subArr].filter(res => namelists.includes(res.ps)).map(res => template(res, host))
}

module.exports = proxies
