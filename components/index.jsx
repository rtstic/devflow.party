'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { BellAlertIcon, XMarkIcon, BuildingStorefrontIcon, UserGroupIcon, CircleStackIcon, CodeBracketIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

import { classNames } from '@/utils';

export function Tab({type, siteId}) {
  const getTabData = () => {
    switch (type) {
      case 'pages':
        return { name: 'Pages', href: `/site/${siteId}/pages`, icon: DocumentDuplicateIcon, disabled: false };
      case 'custom-code':
        return { name: 'Custom Code', href: `/site/${siteId}/custom-code`, icon: CodeBracketIcon, disabled: false };
      case 'webhooks':
        return { name: 'Webhooks', href: `/site/${siteId}/webhooks`, icon: BellAlertIcon, disabled: true };
      case 'cms':
        return { name: 'CMS', href: `/site/${siteId}/cms`, icon: CircleStackIcon, disabled: true };
      case 'ecommerce':
        return { name: 'Ecommerce', href: `/site/${siteId}/ecommerce`, icon: BuildingStorefrontIcon, disabled: true };
      default:
        return { name: 'Memberships', href: `/site/${siteId}/memberships`, icon: UserGroupIcon, disabled: true };
    }
  };

  const current_path = usePathname();
  const tab_data = getTabData();
  const current = current_path.includes(tab_data.href);
  return (
    <Link
    key={tab_data.name}
    href={tab_data.disabled ? '/' : tab_data.href}
    className={classNames(
      current
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500',
        tab_data.disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-blue-600 hover:text-blue-600',
      'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
    )}
    aria-current={current ? 'page' : undefined}
  >
    <tab_data.icon
      className={classNames(
        current ? 'text-blue-600' : 'text-gray-400',
        tab_data.disabled ? '' : 'group-hover:text-blue-600',
        '-ml-0.5 mr-2 h-5 w-5'
      )}
      aria-hidden="true"
    />
    <span>{tab_data.name}</span>
  </Link>
  )    
}

export function Banner({Icon, content, handleClose, color}){
  const colorClasses = {
    red: {
      container: 'bg-red-50',
      icon: 'text-red-500',
      text: 'text-red-800',
      button: 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50',
    },
    green: {
      container: 'bg-green-50',
      icon: 'text-green-500',
      text: 'text-green-800',
      button: 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50',
    },
  };
  const classes = colorClasses[color];
  
  return (
    <div className={`rounded-md ml-20 p-4 fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-8 z-50 ${classes.container}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${classes.icon}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${classes.text}`}>{content}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 ${classes.button} focus:outline-none focus:ring-2`}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}