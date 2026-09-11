import fetch from "node-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";

const agent = new SocksProxyAgent("socks5h://127.0.0.1:10808");

export function socksFetch(url, options = {}) {
  return fetch(url, { ...options, agent });
}
