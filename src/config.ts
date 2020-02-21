// @ts-ignore
const ENV = window.ENV;

// 是否是内网环境
const innerNet =  process.env.NODE_ENV === 'dev' ? true : /^(192|0|127|172|localhost)/.test(location.hostname);

// 当前域名
let domain = ENV.domain;
if (ENV.domain) {
  domain = ENV.domain;
} else {
  domain = location.protocol + '//' + location.host;
}

const baseURL = /^(http:\/\/|https:\/\/)/.test(ENV.wgmsBaseWeb) ?
    ENV.wgmsBaseWeb :
   ENV.wgmsBaseWeb;

// cas单点登录地址
const casBaseURL = /^(http:\/\/|https:\/\/)/.test(ENV.casDomain) ?
  getDomain(ENV.casDomain, innerNet) :
  domain + ENV.casDomain;

// 当前前端页面地址
const webHomePage = /^(http:\/\/|https:\/\/)/.test(ENV.webHomePage) ?
  getDomain(ENV.webHomePage, innerNet) :
  domain + ENV.webHomePage;

// 当前web页面访问地址
const webHomePageStr =  encodeURIComponent(webHomePage);


export  {
  innerNet,
  domain,
  baseURL,
  casBaseURL,
  webHomePage,
  ENV,
};

function getDomain(domainStr: string, innerNets?: boolean): string {
  const domains = domainStr.split('|');
  return innerNet ? domains[0] : domains[1];
}
