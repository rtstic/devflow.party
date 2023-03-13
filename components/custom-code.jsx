'use client';

import React, { useState } from 'react';
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import { CalendarIcon, CommandLineIcon, MegaphoneIcon } from '@heroicons/react/24/outline'

import { classNames, timeAgo, getTitleTimestamp } from '@/utils'

const items = [
  {
    name: 'Marketing Campaign',
    description: 'I think the kids call these memes these days.',
    href: '#',
    iconColor: 'bg-pink-500',
    icon: MegaphoneIcon,
  },
  {
    name: 'Engineering Project',
    description: 'Something really expensive that will ultimately get cancelled.',
    href: '#',
    iconColor: 'bg-purple-500',
    icon: CommandLineIcon,
  },
  {
    name: 'Event',
    description: 'Like a conference all about you that no one will care about.',
    href: '#',
    iconColor: 'bg-yellow-500',
    icon: CalendarIcon,
  },
]

export default function CustomCode({ savedCode }) {
  const JSCode = `const App = props => {
    return (
      <div>
        <h1> Prism JS </h1>
        <div>Awesome Syntax Highlighter</div>
      </div>
    );
  };
  `;
  const [code, setCode] = useState(JSCode);
  const [lineCount, setLineCount] = useState(code.split('\n').length);
  const [showEditView, setShowEditView] = useState(savedCode ? true : false);

  const onInputSetCode = (event) => {
    const c = event.target.value;
    const numberOfLines = c.split('\n').length
    setCode(c);
    setLineCount(numberOfLines);
  }

  const onKeyDownTabOver = (event) => {
    if (event.key === 'Tab') {
      const textarea = document.querySelector('textarea')
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end)

      event.preventDefault()
    }
  }

  const getLabel = () => (
    <div className="rounded-t-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <label htmlFor="editor" className="block text-sm font-medium leading-6 text-blue-700">
            Any custom code saved here will be added to the &lt;head&gt; tag of this site.
          </label>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <p className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
              Characters left: {2000 - code.length}
            </p>
          </p>
        </div>
      </div>
    </div>
  )

  if (showEditView) {
    const spanList = Array.from({ length: lineCount }, (_, index) => (
      <span key={index} className="[counter-increment:linenumber] before:[content:counter(linenumber)] before:block before:text-blue-500"/>
    ));
    return (
      <div>
        {getLabel()}
        <div className="inline-flex w-full gap-5 font-mono leading-5 bg-gray-900 rounded-b-md p-4 min-h-full">
          <div id='line-numbers' className="w-5 text-right">
            {spanList}
          </div>
          <textarea
            className="block w-full flex-1 resize-none overflow-y-hidden leading-5 h-full p-0 border-0 bg-gray-900 text-white min-w-500px outline-none"
            id="editor"
            name="editor"
            onKeyDown={onKeyDownTabOver}
            rows={lineCount}
            onInput={onInputSetCode}
            onPaste={onInputSetCode}
            value={code}
          />
        </div>
        <div className="inset-x-0 bottom-0 flex justify-end py-2">
          {savedCode &&
            <div className="flex grow items-center space-x-5" title={getTitleTimestamp(savedCode.updatedAt || savedCode.createdAt)}>
              Last updated {timeAgo(savedCode.updatedAt || savedCode.createdAt)}
            </div>
          }
          <div className="flex-shrink-0">
            <button
              type="submit"
              className="inline-flex mr-1 items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              onClick={() => { setShowEditView(false) }}
            >
              delete
            </button>
            <button
              type="submit"
              disabled={code.length > 2000 || code.length === 0}
              className={
                classNames(code.length > 2000 || code.length === 0 ? "bg-gray-400" : "bg-green-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                "inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm"
                )
              }
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto my-auto pt-5">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Add custom code to your site</h2>
      <p className="mt-1 text-sm text-gray-500">Get started by selecting a template or start from scratch.</p>
      <ul role="list" className="mt-6 divide-y divide-gray-200 border-t border-b border-gray-200">
        {items.map((item, itemIdx) => (
          <li key={itemIdx}>
            <div className="group relative flex items-start space-x-3 py-4">
              <div className="flex-shrink-0">
                <span
                  className={classNames(item.iconColor, 'inline-flex h-10 w-10 items-center justify-center rounded-lg')}
                >
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  <a href={item.href}>
                    <span className="absolute inset-0" aria-hidden="true" />
                    {item.name}
                  </a>
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <div className="flex-shrink-0 self-center">
                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex">
        <div onClick={()=> setShowEditView(true)} className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Start from scratch
          <span aria-hidden="true"> &rarr;</span>
        </div>
      </div>
    </div>
  )
}
