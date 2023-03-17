'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { CloudIcon, InformationCircleIcon, CommandLineIcon, DocumentCheckIcon, PaperAirplaneIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'

import { Banner } from '@/components';
import { classNames, timeAgo, getTitleTimestamp, dedent } from '@/utils'

const templates = [
  {
    name: 'Flying text',
    description: 'This code displays flying text across the top of your site.',
    code: dedent`
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const text = document.createElement('div');
          text.textContent = 'Flying Text';
          text.style.position = 'absolute';
          text.style.zIndex = '9999';
          text.style.fontSize = '24px';
          text.style.fontWeight = 'bold';
          text.style.color = 'red';
          document.body.insertBefore(text, document.body.firstChild);
      
          let x = 0;
          setInterval(() => {
            x = (x + 1) % window.innerWidth;
            text.style.left = x + 'px';
          }, 10);
        });
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
    code: dedent`
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const flakes = [];
          const numFlakes = 150;
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          let w = canvas.width = window.innerWidth;
          let h = canvas.height = window.innerHeight;
          canvas.style.position = 'fixed';
          canvas.style.zIndex = '9999';
          canvas.style.pointerEvents = 'none';
          document.body.insertBefore(canvas, document.body.firstChild);
      
          window.addEventListener('resize', () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
          });
      
          function createSnowFlake() {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const speed = Math.random() * 5 + 1;
            const radius = Math.random() * 4 + 1;
            return {x, y, speed, radius};
          }
      
          function initSnowFlakes() {
            for (let i = 0; i < numFlakes; i++) {
              flakes.push(createSnowFlake());
            }
          }
      
          function drawSnowFlakes() {
            context.clearRect(0, 0, w, h);
            context.fillStyle = 'white';
            context.beginPath();
            for (let i = 0; i < flakes.length; i++) {
              const flake = flakes[i];
              context.moveTo(flake.x, flake.y);
              context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true);
            }
            context.fill();
            moveSnowFlakes();
          }
      
          function moveSnowFlakes() {
            for (let i = 0; i < flakes.length; i++) {
              const flake = flakes[i];
              flake.y += flake.speed;
              if (flake.y > h) {
                flake.y = Math.random() * -h;
                flake.x = Math.random() * w;
              }
            }
            requestAnimationFrame(drawSnowFlakes);
          }
      
          initSnowFlakes();
          moveSnowFlakes();
        });
      </script>
    `,
    iconColor: 'bg-yellow-500',
    icon: CloudIcon,
  },
]

export default function CustomCode({ siteId, savedCode }) {
  const [lastUpdated, setLastUpdated] = useState(savedCode?.lastUpdated || null);
  const [code, setCode] = useState(savedCode?.code || '');
  const [lineCount, setLineCount] = useState(code.split('\n').length);
  const [showEditView, setShowEditView] = useState(savedCode ? true : false);
  const [savedCodeState, setSavedCodeState] = useState(savedCode);
  const [whichBannerToShow, setWhichBannerToShow] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    let timeout;
    if (bannerVisible) {
      timeout = setTimeout(() => {
        setBannerVisible(false);
        setWhichBannerToShow(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [setBannerVisible, setWhichBannerToShow, bannerVisible]);

  const onInputSetCode = useCallback((event) => {
    const c = event.target.value;
    const numberOfLines = c.split('\n').length
    setCode(c);
    setLineCount(numberOfLines);
  }, []);

  const onKeyDownTabOver = useCallback((event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentLineStart = textarea.value.lastIndexOf('\n', start) + 1;
      const currentLineEnd = textarea.value.indexOf('\n', start);
      const currentLine = textarea.value.substring(currentLineStart, currentLineEnd === -1 ? undefined : currentLineEnd);
  
      if (event.shiftKey) {
        // Un-indent with Shift+Tab
        if (currentLine.startsWith('\t')) {
          const newLine = currentLine.substring(1);
          textarea.value = textarea.value.substring(0, currentLineStart) + newLine + textarea.value.substring(currentLineEnd === -1 ? undefined : currentLineEnd);
          textarea.selectionStart = start - 1;
          textarea.selectionEnd = end - 1;
        }
      } else {
        // Indent with Tab
        textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
      }
    }
  }, []);

  const clearCode = useCallback(() => {
    setCode('');
    setLineCount(1);
  }, []);

  const deleteCode = useCallback(async () => {
    let codeWasDeleted = false;
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
          codeWasDeleted = true;
        }
      } catch (error) {
        console.error('Error deleting code on server:', error);
      }
    }
    if (!savedCodeState?.code){
      setCode('');
      setShowEditView(false);
      setLineCount(1);
      setSavedCodeState(null);
      codeWasDeleted = true;
    }
    if (codeWasDeleted){
      setWhichBannerToShow("deleted");
      setBannerVisible(true);
    }
  }, [lastUpdated, savedCodeState, siteId]);

  const writeCode = useCallback(async () => {
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
        setSavedCodeState(res.data);
        setWhichBannerToShow("success");
        setBannerVisible(true);
      } else {
        throw new Error('Custom code write failed');
      }
    } catch (error) {
      console.error('Error writing code on server:', error);
    }
  }, [code, siteId]);
  
  const selectTemplate = useCallback((t) => {
    setShowEditView(true);
    setCode(t.code);
    setLineCount(t.code.split('\n').length);
  }, []);

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
            id="customCodeEditor"
            name="editor"
            ref={textareaRef}
            onKeyDown={onKeyDownTabOver}
            rows={lineCount}
            maxLength={2000}
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
        {whichBannerToShow === "success" && bannerVisible && <Banner Icon={DocumentCheckIcon} content="Custom code saved" color="green" handleClose={() => setBannerVisible(false)} />}
      </div>
    )
  }

  return (
    <div className="mx-auto my-auto pt-5">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Add custom code to your site</h2>
      <p className="mt-1 text-sm text-gray-500">Get started by selecting a template or start from scratch.</p>
      <ul role="list" className="mt-6 grid grid-cols-1 gap-6 border-t border-b border-gray-200 py-6 sm:grid-cols-2">
        {templates.map((t, tId) => (
          <li key={tId} className="flow-root">
            <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500 hover:bg-gray-50">
              <div
                  className={classNames(
                    t.iconColor,
                    'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg'
                  )}
                >
                  <t.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div>
                <h3 className="text-sm font-medium text-gray-900">
                  <div onClick={() => selectTemplate(t)} className="focus:outline-none">
                    <span className="absolute cursor-pointer inset-0" aria-hidden="true" />
                    <span>{t.name}</span>
                    <span aria-hidden="true"> &rarr;</span>
                  </div>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{t.description}</p>
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
      {whichBannerToShow === "deleted" && bannerVisible && <Banner Icon={TrashIcon} content="Custom code deleted" color="red" handleClose={() => setBannerVisible(false)} />}
    </div>
  )
}
