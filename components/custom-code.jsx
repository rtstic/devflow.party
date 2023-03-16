'use client';

import React, { useEffect, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { CloudIcon, CommandLineIcon, DocumentCheckIcon, PaperAirplaneIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'

import { Banner } from '.';
import { classNames, timeAgo, getTitleTimestamp, dedent } from '@/utils'

const items = [
  {
    name: 'Flying text',
    description: 'This code displays flying text across the top of your site.',
    code: dedent`
      <script>
        const text = document.createElement('div');
        text.innerText = "Flying Text";
        text.style.position = "absolute";
        document.body.appendChild(text);

        let x = 0;
        setInterval(() => {
          x = (x + 1) % window.innerWidth;
          text.style.left = x + "px";
        }, 10);
      </script>
    `,
    iconColor: 'bg-pink-500',
    icon: PaperAirplaneIcon,
  },
  {
    name: 'Glitch',
    description: 'This code will add a glitch effect to the page by randomly altering the positions of all elements',
    code: '#',
    iconColor: 'bg-purple-500',
    icon: CommandLineIcon,
  },
  {
    name: 'Snowfall',
    description: 'This effect creates a trail of colorful particles that follow your mouse as you move it around the page.',
    code: '#',
    iconColor: 'bg-yellow-500',
    icon: CloudIcon,
  },
]

export default function CustomCode({ siteId, savedCode }) {
  const [lastUpdated, setLastUpdated] = useState(savedCode?.lastUpdated || null);
  const [code, setCode] = useState(savedCode?.code || '');
  const [lineCount, setLineCount] = useState(code.split('\n').length);
  const [showEditView, setShowEditView] = useState(savedCode ? true : false);
  const [showBanner, setShowBanner] = useState("");

  useEffect(() => {
    let timeout;
    if (showBanner) {
      timeout = setTimeout(() => {
        setShowBanner("");
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showBanner]);

  const onInputSetCode = (event) => {
    const c = event.target.value;
    const numberOfLines = c.split('\n').length
    setCode(c);
    setLineCount(numberOfLines);
  }

  const onKeyDownTabOver = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      const textarea = document.querySelector('textarea')
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end)
    }
  }

  const clearCode = () => {
    setCode('');
    setLineCount(1);
  }

  const deleteCode = async () => {
    if (lastUpdated) {
      try {
        const response = await fetch('/api/custom-code', {
          method: 'DELETE',
          body: JSON.stringify({ siteId }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const res = await response.json();
        if (res.deleted) {
          setCode('');
          setLastUpdated(null);
          setShowEditView(false);
          setLineCount(1);
        }
      } catch (error) {
        console.error('Error deleting code on server:', error);
      }
    }
    if (!savedCode?.code){
      setCode('');
      setShowEditView(false);
      setLineCount(1);
      savedCode = null;
    }
    setShowBanner("deleted");
  }

  async function writeCode() {
    try {
      const response = await fetch('/api/custom-code', {
        method: 'PUT',
        body: JSON.stringify({ code, siteId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const res = await response.json();
        setLastUpdated(res.data.lastUpdated);
        setCode(res.data.code);
        savedCode = res.data;
        setShowBanner("success");
      } else {
        throw new Error('Custom code write failed');
      }
    } catch (error) {
      console.error('Error writing code on server:', error);
    }
  }
  
  const selectTemplate = (item) => {
    setShowEditView(true);
    setCode(item.code);
    setLineCount(item.code.split('\n').length);
  };

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
          <div className="mt-3 text-sm md:mt-0 md:ml-6">
            <p className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
              Characters left: {2000 - code.length}
            </p>
          </div>
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
            className="block placeholder:text-gray-300 w-full flex-1 resize-none overflow-y-hidden leading-5 h-full p-0 border-0 bg-gray-900 text-white min-w-500px outline-none"
            id="editor"
            name="editor"
            onKeyDown={onKeyDownTabOver}
            rows={lineCount}
            onInput={onInputSetCode}
            onPaste={onInputSetCode}
            value={code}
            placeholder='Add code here. e.g. &lt;script&gt;alert("Hello, world!");&lt;/script&gt;'
          />
        </div>
        <div className="inset-x-0 bottom-0 flex justify-end py-2">
          {lastUpdated &&
            <div className="flex grow items-center space-x-5" title={getTitleTimestamp(lastUpdated)}>
              Last updated {timeAgo(lastUpdated)}
            </div>
          }
          <div className="flex-shrink-0">
            <button
              type="submit"
              className="inline-flex mr-1 items-center rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700"
              onClick={clearCode}
            >
              <XCircleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
              Clear
            </button>
            <button
              type="submit"
              className="inline-flex mr-1 items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
              onClick={deleteCode}
            >
              <TrashIcon className="h-5 w-5 mr-1" aria-hidden="true" />
              Delete
            </button>
            <button
              type="submit"
              disabled={code.length > 2000 || code.length === 0}
              className={
                classNames(code.length > 2000 || code.length === 0 ? "bg-white text-gray-400 border-gray-300 border" : "bg-green-600 text-white hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800",
                "inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
                )
              }
              onClick={writeCode}
            >
              <DocumentCheckIcon className="h-5 w-5 mr-1" aria-hidden="true" />
              Save
            </button>
          </div>
        </div>
        {showBanner === "success" && <Banner Icon={DocumentCheckIcon} content="Custom code saved" color="green" handleClose={() => setBannerVisible(false)} />}
      </div>
    )
  }

  return (
    <div className="mx-auto my-auto pt-5">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Add custom code to your site</h2>
      <p className="mt-1 text-sm text-gray-500">Get started by selecting a template or start from scratch.</p>
      <ul role="list" className="mt-6 grid grid-cols-1 gap-6 border-t border-b border-gray-200 py-6 sm:grid-cols-2">
        {items.map((item, itemIdx) => (
          <li key={itemIdx} className="flow-root">
            <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-50">
              <div
                  className={classNames(
                    item.iconColor,
                    'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg'
                  )}
                >
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div>
                <h3 className="text-sm font-medium text-gray-900">
                  <div onClick={() => selectTemplate(item)} className="focus:outline-none">
                    <span className="absolute cursor-pointer inset-0" aria-hidden="true" />
                    <span>{item.name}</span>
                    <span aria-hidden="true"> &rarr;</span>
                  </div>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex">
        <div onClick={()=> setShowEditView(true)} className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500">
          Start from scratch
          <span aria-hidden="true"> &rarr;</span>
        </div>
      </div>
      {showBanner === "deleted" && <Banner Icon={TrashIcon} content="Custom code deleted" color="red" handleClose={() => setBannerVisible(false)} />}
    </div>
  )
}
