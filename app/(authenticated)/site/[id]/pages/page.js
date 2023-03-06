import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper'
import { DocumentIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default async function PageTab({ params: { id: siteId } }){
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  const pages = await webflowAPI.pages({siteId});
  // TODO: Add pagination component: https://tailwindui.com/components/application-ui/navigation/pagination#component-f9a9347de5384a492c79c34cf6ce3ccf
  return (
    <div className="mt-4 flow-root">
      <ul role="list" className="-my-5 divide-y divide-gray-200">
        {pages.map((page) => (
          <li key={page.id} className="py-4 ">
            <div className="flex items-center space-x-2 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 hover:border-blue-600 hover:text-blue-600 group">
              <div className="relative w-8 h-8 rounded-2xl text-white overflow-hidden transition-all duration-700 group-hover:card">
                <div className="absolute inset-0 w-full h-full flex justify-center items-center transition-all duration-100 delay-200 z-20 group-hover:opacity-0">
                  <DocumentIcon className="h-8 w-8 text-gray-600" />
                </div>
                <div className="absolute inset-0 w-full h-full flex justify-center items-center transition-all z-10 card-back opacity-0 group-hover:opacity-100 duration-1000">
                  <DocumentMagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="relative focus-">
                <h3 className="text-sm font-semibold group-hover:text-blue-500 text-gray-600">
                  <div className="group-hover:underline focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {page.seoTitle || page.title}
                  </div>
                </h3>
                {page.seoDesc && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{page.seoDesc}</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}