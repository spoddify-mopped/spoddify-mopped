import Logger from './logger/logger';
import ciao from '@homebridge/ciao';
import { getActiveNetworkInterface } from './utils/network';

const logger = Logger.create('mDNS');

const getMacAddress = (): string => {
  const activeNetworkInterface = getActiveNetworkInterface();
  return activeNetworkInterface.mac.replace(/:/g, '_').toUpperCase();
};

const startMdnsAdvertisement = (port: number) => {
  const responder = ciao.getResponder();

  const service = responder.createService({
    hostname: `spoddify-mopped-${getMacAddress()}`,
    name: 'Spoddify Mopped',
    port,
    type: 'http',
  });

  service.advertise().then(() => {
    logger.debug(`Advertisement started for service 'http' on port ${port}`);
  });
};

export default startMdnsAdvertisement;
