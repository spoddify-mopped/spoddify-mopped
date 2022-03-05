import { NetworkInterfaceInfo, networkInterfaces } from 'os';

const getActiveNetworkInterface = (): NetworkInterfaceInfo => {
  return Object.values(networkInterfaces())
    .flat()
    .filter((item) => !item.internal && item.family === 'IPv4')[0];
};

export { getActiveNetworkInterface };
