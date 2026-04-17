export interface WebhookConfig {
  notHome: string;
  notInterested: string;
  lead: string;
  sale: string;
}

export const salesConfig = {
  webhookUrl: 'https://hook.us1.make.com/your-webhook-id-here',
  calendarWebhookUrl: 'https://hook.us1.make.com/your-calendar-webhook',
  webhooks: {
    notHome: '',
    notInterested: '',
    lead: '',
    sale: ''
  } as WebhookConfig,
  services: [
    'Window Cleaning',
    'Gutter Cleaning',
    'Pressure Washing',
    'Window Tinting',
    'Solar Panel Cleaning'
  ]
};
