import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper'
import Image from 'next/image';
import { classNames } from '@/utils';
import { BellAlertIcon, BuildingStorefrontIcon, UserGroupIcon, CircleStackIcon, CodeBracketIcon, DocumentDuplicateIcon, RssIcon } from '@heroicons/react/24/outline';

export default async function SiteLayout({ params: { id: siteId }, children }) {
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  const [site, pages] = await Promise.all([webflowAPI.site({siteId}), webflowAPI.pages({siteId})]);
  const tabs = [
    { name: 'Pages', href: '#', icon: DocumentDuplicateIcon, current: true, disabled: false },
    { name: 'Custom Code', href: '#', icon: CodeBracketIcon, current: false, disabled: true },
    { name: 'Webhooks', href: '#', icon: BellAlertIcon, current: false, disabled: true },
    { name: 'CMS', href: '#', icon: CircleStackIcon, current: false, disabled: true },
    { name: 'Ecommerce', href: '#', icon: BuildingStorefrontIcon, current: false, disabled: true },
    { name: 'Memberships', href: '#', icon: UserGroupIcon, current: false, disabled: true },
  ]

  const getSiteInfo = () => {
    return (
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Site Info</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex">
            <div className="mr-8">
              <Image
              className="aspect-[3/2] w-full rounded-2xl object-cover border border-black"
              src={site.previewUrl}
              alt=""
              width={400}
              height={300}
              />
            </div>
            <div className="grow flex flex-col-reverse space-y-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-lg font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-lg text-gray-900">{site.displayName}</dd>
                  <dt className="text-lg font-medium text-gray-500">Short Name</dt>
                  <dd className="mt-1 text-lg text-gray-900">{site.shortName}</dd>
                  <dt className="text-lg font-medium text-gray-500">Time Zone</dt>
                  <dd className="mt-1 text-lg text-gray-900">{site.timeZone}</dd>
                  <dt className="text-lg font-medium text-gray-500">Created On</dt>
                  <dd className="mt-1 text-lg text-gray-900">{site.createdOn}</dd>
                  <dt className="text-lg font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-lg text-gray-900">{site.lastUpdated}</dd>
                  <dt className="text-lg font-medium text-gray-500">Last Published</dt>
                  <dd className="mt-1 text-lg text-gray-900">{site.lastPublished}</dd>
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
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-4 sm:px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  disabled={tab.disabled}
                  className={classNames(
                    tab.current
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500',
                    tab.disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-blue-600 hover:text-blue-600',
                    'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  <tab.icon
                    className={classNames(
                      tab.current ? 'text-blue-600' : 'text-gray-400',
                      tab.disabled ? '' : 'group-hover:text-blue-600',
                      '-ml-0.5 mr-2 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                  <span>{tab.name}</span>
                </a>
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
    <div className="flex flex-col space-y-4">
      {getSiteInfo()}
      {getSiteTabs()}
    </div>
  )
}
