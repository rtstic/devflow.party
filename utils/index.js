/**
 * Concatenates multiple class names into a single string and returns it.
 * 
 * @param {...string} classes - The class names to concatenate.
 * @returns {string} A string containing all the class names separated by spaces.
 */
export function classNames(...classes) {
  // Use the filter() method to remove any falsy values from the classes array.
  // This allows the function to handle conditional class names like:
  //    className={classNames('button', isLoading && 'loading')}
  // In this example, if isLoading is false, the second argument to classNames()
  // will be falsy and filtered out, so only the 'button' class name will be used.
  const filteredClasses = classes.filter(Boolean);
  
  // Use the join() method to concatenate the remaining class names into a
  // single string with spaces between them.
  return filteredClasses.join(' ');
}

/**
 * Calculates the time difference between a given timestamp (in ISO 8601 format
 * or Unix timestamp in seconds) and the current time, and returns a string that
 * says how long ago the timestamp was (e.g. "2 hours ago").
 * 
 * @param {string|number} timestamp - The timestamp to convert, in ISO 8601 format
 * or Unix timestamp in seconds.
 * @returns {string} A string that says how long ago the timestamp was.
 */
export function timeAgo(timestamp) {
  // Create Date objects for the current time and the timestamp
  const now = new Date();
  const then = new Date(timestamp);
  
  // Calculate the time difference in milliseconds
  const diff = now.getTime() - then.getTime();
  
  // Calculate the time difference in seconds, minutes, hours, days, weeks,
  // months, and years, and return a string that says how long ago the
  // timestamp was.
  const secondsAgo = Math.floor(diff / 1000);
  if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo === 1) {
    return 'yesterday';
  }
  if (daysAgo < 7) {
    return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  }
  
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo === 1) {
    return '1 week ago';
  }
  if (weeksAgo < 4) {
    return `${weeksAgo} weeks ago`;
  }
  
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo === 1) {
    return '1 month ago';
  }
  if (monthsAgo < 12) {
    return `${monthsAgo} months ago`;
  }
  
  const yearsAgo = Math.floor(daysAgo / 365);
  if (yearsAgo === 1) {
    return '1 year ago';
  }
  return `${yearsAgo} years ago`;
}

/**
 * Formats a timestamp (in ISO 8601 format or Unix timestamp in seconds) as a
 * human-readable string that can be used as the `title` attribute for an HTML
 * element.
 *
 * @param {string|number} timestamp - The timestamp to format, in ISO 8601 format
 * or Unix timestamp in seconds.
 * @returns {string} A formatted string that can be used as the `title` attribute.
 */
export function getTitleTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}