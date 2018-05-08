/**
 * Removes leading, trailing and double whitespaces
 * @param {string} str - String to sanitize
 * @param {boolean=} [trimTails] - Will trim trailing whitespaces if true
 * @returns {string} - Sanitized string
 */
export const sanitizeWhitespaces = (str, trimTails = false) => {
  // DEBUG: console.log('>' + str.length + ':"' + str.replace(/\s/g,'*') + '"');
  str = str.replace(/\s\s+/g,' ');
  str = str.replace(/^\s/,'');
  if (trimTails) str = str.replace(/\s$/,'');
  // DEBUG: console.log('<' + str.length + ':"' + str.replace(/\s/g,'*') + '"');
  return str;
};
