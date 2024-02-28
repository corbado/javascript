import { Config, SDK } from '@corbado/node-sdk';

export default function createNodeSDK() {
  const projectID = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!;
  const apiSecret = process.env.CORBADO_API_SECRET!;

  const config = new Config(projectID, apiSecret);
  return new SDK(config);
}
