

import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('id');
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  const page = await webflowAPI.page({pageId});
  return Response.json(page);
}
