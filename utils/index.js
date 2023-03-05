import { redirect } from 'next/navigation';

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function client_side_logout(redirect_to = '/login') {
  fetch('/api/logout', { method: 'POST' })
  .then(response => {
    if (response.ok) {
      redirect(redirect_to);
    } else {
      throw new Error('Logout failed');
    }
  })
  .catch(error => {
    console.error('Error logging out', error);
  });
}