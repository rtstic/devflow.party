import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper'
import Image from 'next/image';
import { Tab } from '@/components';
import { timeAgo, getTitleTimestamp, placeholderImage } from '@/utils';

export default async function SiteLayout({ params: { id: siteId }, children }) {
  // TODO: Stop duplicating this code
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  const site = await webflowAPI.site({siteId});

  const tabs = [
    'pages',
    'custom-code',
    'webhooks',
    'cms',
    'ecommerce',
    'memberships',
  ];

  const getSiteInfo = () => {
    return (
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Site Info</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex">
            <div className="mr-8 overflow-hidden">
              <Image
                className="top-0 left-0 object-contain rounded-2xl border border-black"
                src={site.previewUrl}
                alt=""
                width={540}
                height={360}
                loading="lazy"
                placeholder='blur'
                blurDataURL={placeholderImage}
              />
            </div>
            <div className="flex-grow flex flex-col-reverse space-y-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-lg font-medium text-gray-500">Name</dt>
                  <dd className="text-lg text-gray-900">{site.displayName}</dd>
                  <dt className="text-lg font-medium text-gray-500">Short Name</dt>
                  <dd className="text-lg text-gray-900">{site.shortName}</dd>
                  <dt className="text-lg font-medium text-gray-500">Time Zone</dt>
                  <dd className="text-lg text-gray-900">{site.timeZone}</dd>
                  <dt className="text-lg font-medium text-gray-500">Created</dt>
                  <dd className="text-lg text-gray-900" title={getTitleTimestamp(site.createdOn)}>{timeAgo(site.createdOn)}</dd>
                  <dt className="text-lg font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-lg text-gray-900" title={getTitleTimestamp(site.lastUpdated)}>{timeAgo(site.lastUpdated)}</dd>
                  <dt className="text-lg font-medium text-gray-500">Last Published</dt>
                  <dd className="text-lg text-gray-900" title={site.lastPublished ? getTitleTimestamp(site.lastPublished) : "Never published!"}>{site.lastPublished ? timeAgo(site.lastPublished) : "Never published!"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>      
    )
  }

  const getSiteTabs = () => {
    return (
      <div className="bg-white shadow sm:rounded-lg flex-1">
        <div className="block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-4 sm:px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <Tab key={tab} type={tab} siteId={siteId} />
              ))}
            </nav>
          </div>
        </div>
        <div className="px-4 py-5 sm:px-6">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {getSiteInfo()}
      {getSiteTabs()}
    </div>
  )
}
