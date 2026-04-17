export interface WebhookConfig {
  notHome: string;
  notInterested: string;
  lead: string;
  sale: string;
}

export const salesConfig = {
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
