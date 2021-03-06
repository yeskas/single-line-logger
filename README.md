# single-line-logger

A thin layer on top of console.log() that makes sure the output stays on one line.

It's particularly useful if your log-tracking tool shows the output of console.log() on multiple lines and in inverse order (e.g. Datadog, Graylog).

Uses serialize-error npm library to serialize non-primitive objects w/ minor tweaks that:
- optimize memory usage
- don't display the "internal" fields of errors (the ones that start w/ "_")

## Installation

```shell
$ npm install single-line-logger
```

## Quick Start

```js
const { _lg, _err } = require('single-line-logger')

// log to stdout on a single line
_lg('Error:', new Error('my multiline error #1'))

// log to stderr on a single line
_err('Error:', new Error('my multiline error #2'))
```
