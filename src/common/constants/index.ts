import { freezeObj } from '@utils';

export const WORKFLOW_TYPE = freezeObj({
  actions: ['delay'],
  channels: ['email', 'push', 'sms'],
});
