import { formsConnector } from './connectors/formsConnector';
import { whatsappConnector } from './connectors/whatsappConnector';
import { emailConnector } from './connectors/emailConnector';
import { virtuagymConnector } from './connectors/virtuagymConnector';
import { googleCalendarConnector } from './connectors/googleCalendarConnector';

export const integrationRegistry = [
  formsConnector,
  whatsappConnector,
  emailConnector,
  googleCalendarConnector,
  virtuagymConnector,
];
