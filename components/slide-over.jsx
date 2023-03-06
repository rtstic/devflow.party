'use client';

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useSWR from 'swr'

import { XMarkIcon } from '@heroicons/react/24/outline';

export function usePageInfo(pageId) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error, isLoading } = useSWR(`/api/page?id=${pageId}`, fetcher)
  return { page_info: data, isLoading, isError: error }
}

export function PageSlideOver({openPageId, setOpenPageId}) {
  const { page_info, isLoading, isError} = usePageInfo(openPageId);
  const [open, setOpen] = useState(true);
  const closeSlideOver = () => {
    setOpenPageId(null);
    setOpen(false);
  };

  const getContent = () => {
    if (isError) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>
    const page_details = Object.entries(page_info).map(([key, value]) => {
      if (key === 'title') return null;
      return (
        <div key={key}>
          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">{key}</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{JSON.stringify(value)}</dd>
        </div>
      );
    });  
    if (page_info) return (
      <Fragment>
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          {page_info.title}
        </h2>
        {page_details}
      </Fragment>
    );
  };

  return (
    <SlideOver title="Page Details" open={open} closeSlideOver={closeSlideOver}>
      <div className="px-4 pt-5 pb-5 sm:px-0 sm:pt-0">
        <dl className="space-y-8 px-4 pt-5 sm:space-y-6 sm:px-6">
          {getContent()}
        </dl>
      </div>
    </SlideOver>
  );
}

export function SlideOver({title, children, open, closeSlideOver}){
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => closeSlideOver()}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="bg-gray-100 px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 id="slide-over-heading" className="text-base font-semibold leading-6 text-gray-900">
                          {title}
                        </h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-gray-100 text-gray-600 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={() => closeSlideOver()}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div>
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}