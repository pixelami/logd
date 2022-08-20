import { networkInterfaces } from 'os';

export const getNetworkAddresses = () => {
  const interfaces = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object
  const interfaceNames = Object.keys(interfaces);
  interfaceNames.forEach((name) => {
    const networks = interfaces[name];
    if (!networks) return;
    networks.forEach((net) => {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    });
  });
  return results;
};

export const getNetworkAddress = () => {
  return getNetworkAddresses()['en0'][0];
};
