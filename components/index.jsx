'use client';

import { usePathname } from 'next/navigation';
import { BellAlertIcon, BuildingStorefrontIcon, UserGroupIcon, CircleStackIcon, CodeBracketIcon, DocumentDuplicateIcon, RssIcon } from '@heroicons/react/24/outline';

import { classNames } from '@/utils';

export function Tab({type, siteId}) {
  const getTabData = () => {
    switch (type) {
      case 'pages':
        return { name: 'Pages', href: `${siteId}/pages`, icon: DocumentDuplicateIcon, disabled: false };
      case 'custom-code':
        return { name: 'Custom Code', href: `${siteId}/custom-code`, icon: CodeBracketIcon, disabled: true };
      case 'webhooks':
        return { name: 'Webhooks', href: `${siteId}/webhooks`, icon: BellAlertIcon, disabled: true };
      case 'cms':
        return { name: 'CMS', href: `${siteId}/cms`, icon: CircleStackIcon, disabled: true };
      case 'ecommerce':
        return { name: 'Ecommerce', href: `${siteId}/ecommerce`, icon: BuildingStorefrontIcon, disabled: true };
      default:
        return { name: 'Memberships', href: `${siteId}/memberships`, icon: UserGroupIcon, disabled: true };
    }
  };

  const current_path = usePathname();
  const tab_data = getTabData();
  const current = current_path.includes(tab_data.href);
  return (
    <a
    key={tab_data.name}
    href={tab_data.href}
    disabled={tab_data.disabled}
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
  </a>
  )    
}