'use client';
import { client_side_logout } from '@/utils'
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline'
import { getInstallUrl } from '@/utils/webflow_helper'

export function LogoutButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
      onClick={() => client_side_logout()}
    >
      <TrashIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
      Logout
    </button>
  );
}

export function ReauthorizeButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-md border border-transparent bg-blue-700 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      onClick={() => client_side_logout(getInstallUrl())}
    >
      <ArrowPathIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
      Reauthorize
    </button>
  );
}