# GitFiend Shell 

This repo enables you to build and package GitFiend.
The source code for the app shell is available in this repo.
The client code will be included but minified for now.

_Requires Rust and Nodejs_

## Dev

Install dependencies: `npm i` 

Compile and watch shell: `npm run watch` 

Run: `npm start`

## Packaging

`npm i` to install deps

`npm run dist -- [options]`

### Options
 - Platform `mac`, `win`, `linux`
 - Arch `x86`, `arm`
 - Bundle Linux: `deb`, `rpm`, `appImage`, or Win: `nsis`, `appx`

Examples:

- `npm run dist -- win x86 nsis`
- `npm run dist -- linux x86 rpm`
- `npm run dist -- linux arm deb`

## Trouble
Use `git submodule update --init --recursive` from the top level repo to clone the missing repos if you didn't clone with `--recursive`
