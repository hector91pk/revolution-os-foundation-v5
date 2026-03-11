import { emailConnector } from './connectors/emailConnector';
import { firebaseConnector } from './connectors/firebaseConnector';
import { formsConnector } from './connectors/formsConnector';
import { googleCalendarConnector } from './connectors/googleCalendarConnector';
import { virtuagymConnector } from './connectors/virtuagymConnector';
import { whatsappConnector } from './connectors/whatsappConnector';

export const integrationRegistry = [
  firebaseConnector,
  formsConnector,
  whatsappConnector,
  emailConnector,
  googleCalendarConnector,
  virtuagymConnector,
];
