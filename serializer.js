// MIT License

// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/**
 * @param {boolean} errorCtx indicates if the current node is part of an error object
 */
const destroyCircular = (from, seen, errorCtx) => {
	errorCtx = errorCtx || (from instanceof Error)

	const to = Array.isArray(from) ? [] : {};

	seen.push(from);

	// TODO: Use `Object.entries() when targeting Node.js 8
	for (const key of Object.keys(from)) {
		// ignore "internal" fields of Error instances
		if (errorCtx) {
			if (key.startsWith('_')) {
				continue
			}
		}

		const value = from[key];

		// ignore functions
		if (typeof value === 'function') {
			continue;
		}

		// copy primitives as is
		if (!value || typeof value !== 'object') {
			to[key] = value;
			continue;
		}

		// objects
		if (seen.includes(value)) {
			to[key] = '[Circular]';
		} else {
			to[key] = destroyCircular(value, seen, errorCtx);
		}
	}

	const commonProperties = ['name', 'message', 'stack', 'code'];

	for (const property of commonProperties) {
		if (typeof from[property] === 'string') {
			to[property] = from[property];
		}
	}

	return to;
};

module.exports = value => {
	if (typeof value === 'object') {
		return destroyCircular(value, [], false);
	}

	// People sometimes throw things besides Error objects…
	if (typeof value === 'function') {
		// JSON.stringify discards functions. We do too, unless a function is thrown directly.
		return `[Function: ${(value.name || 'anonymous')}]`;
	}

	return value;
};
