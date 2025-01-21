import { createServer } from 'node:http';
import type { Server } from 'node:net';

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import ngrok from 'ngrok';

import { WebhookTypes } from '../utils/Constants';

export class WebhookModel {
  page: Page;
  webhookServer: Server | null = null;
  webhookEndpointID: string | null = null;
  latestWebhookType: WebhookTypes | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  async createWebhookEndpoint(webhookTypes: WebhookTypes[]) {
    if (this.webhookServer || this.webhookEndpointID) {
      throw new Error('Webhook endpoint already created');
    }

    if (!process.env.PLAYWRIGHT_CONNECT_PROJECT_ID) {
      throw new Error('PLAYWRIGHT_CONNECT_PROJECT_ID not set');
    }

    const port = 3001;

    await new Promise(resolve => {
      this.webhookServer = createServer((req, res) => {
        if (req.method === 'POST' && req.url === '/webhook') {
          let body = '';
          req.on('data', chunk => (body += chunk));
          req.on('end', () => {
            const receivedWebhookType = JSON.parse(body).type;
            expect(Object.values(WebhookTypes)).toContain(receivedWebhookType);
            this.latestWebhookType = receivedWebhookType as WebhookTypes;
            res.writeHead(200);
            res.end('OK');
          });
        } else {
          res.writeHead(404);
          res.end();
        }
      });
      this.webhookServer.listen(port, () => {
        console.log(`Webhook server running at http://localhost:${port}`);
        resolve(this.webhookServer);
      });
    });

    const publicUrl = await ngrok.connect({
      addr: port,
      authtoken: process.env.PLAYWRIGHT_NGROK_AUTH_TOKEN,
    });
    const createRes = await fetch(`${process.env.BACKEND_API_URL}/v2/webhookEndpoints`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${process.env.BACKEND_API_BASIC_AUTH}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `${publicUrl}/webhook`,
        subscribedEvents: webhookTypes,
        customHeaders: { 'X-Custom-Header': 'custom-value' },
      }),
    });
    expect(createRes.ok).toBeTruthy();

    const res_data = await createRes.json();
    console.log(res_data);
    this.webhookEndpointID = res_data.id;
  }

  expectWebhookRequest(webhookType: WebhookTypes) {
    expect(this.latestWebhookType).toEqual(webhookType);
  }

  async deleteWebhookEndpoint() {
    if (!this.webhookServer || !this.webhookEndpointID) {
      throw new Error('Webhook endpoint not yet created');
    }

    if (!process.env.PLAYWRIGHT_CONNECT_PROJECT_ID) {
      throw new Error('PLAYWRIGHT_CONNECT_PROJECT_ID not set');
    }

    const deleteRes = await fetch(`${process.env.BACKEND_API_URL}/v2/webhookEndpoints/${this.webhookEndpointID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${process.env.BACKEND_API_BASIC_AUTH}`,
        'Content-Type': 'application/json',
      },
    });
    expect(deleteRes.ok).toBeTruthy();

    this.webhookServer.close();
    await ngrok.disconnect();
  }
}
