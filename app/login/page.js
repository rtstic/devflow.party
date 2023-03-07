import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import { getInstallUrl } from '@/utils/webflow_helper';
import Image from 'next/image';
import logo from '@/public/logo.svg';
import Link from 'next/link';

export default function Login() {
    return (
        <div className="flex min-h-full items-center justify-center py-12 h-screen px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <Image
                    className="mx-auto h-12 w-auto pb-4"
                    src={logo}
                    alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Login with your Webflow account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                    This is demo app that explores the possibilities of what you could build with the Webflow API. 
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <Link
                    href={getInstallUrl()}
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockClosedIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
                    </span>
                    Login
                    </Link>
                </div>
            </div>
        </div>        
    )
}