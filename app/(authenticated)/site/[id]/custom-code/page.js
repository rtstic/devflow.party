'use client';

import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { CalendarIcon, CommandLineIcon, MegaphoneIcon } from '@heroicons/react/24/outline'

import { classNames } from '@/utils'

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

export default function CustomCodePage({ siteId }) {
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
  const [showEditView, setShowEditView] = useState(false);

  const onKeyUpSetCode = (event) => {
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

  if (!showEditView) {
    const spanList = Array.from({ length: lineCount }, (_, index) => (
      <span key={index} className="[counter-increment:linenumber] before:[content:counter(linenumber)] before:block before:text-blue-500"/>
    ));
    return (
      <div>
        <label htmlFor="editor" className="block text-sm font-medium leading-6 text-gray-900">
          Add custom code to the &lt;head&gt; tag:
        </label>
        <div className="inline-flex w-full gap-10 font-mono leading-5 bg-gray-900 rounded-md p-4 min-h-full">
          <div id='line-numbers' className="w-5 text-right">
            {spanList}
          </div>
          <textarea
            className="block w-full flex-1 overflow-y-hidden leading-5 h-full p-0 border-0 bg-gray-900 text-white min-w-500px outline-none"
            id="editor"
            name="editor"
            onKeyDown={onKeyDownTabOver}
            rows={lineCount}
            onInput={onKeyUpSetCode}
            value={code}
          />
        </div>
        <div className="inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
        <div className="flex items-center space-x-5">
          Last updated 2 days ago
        </div>
        <div className="flex-shrink-0">
        <button
            type="submit"
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            delete
          </button>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
      </div>
    )
  }

  return (
    <div className="mx-auto my-auto">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Create your first project</h2>
      <p className="mt-1 text-sm text-gray-500">Get started by selecting a template or start from an empty project.</p>
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
        <div onClick={()=> setShowEditView(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Or start from an empty project
          <span aria-hidden="true"> &rarr;</span>
        </div>
      </div>
    </div>
  )
}
