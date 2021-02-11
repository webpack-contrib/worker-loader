# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.8](https://github.com/webpack-contrib/worker-loader/compare/v3.0.7...v3.0.8) (2021-02-11)


### Bug Fixes

* make inline workers work from inside workers ([#307](https://github.com/webpack-contrib/worker-loader/issues/307)) ([2abd129](https://github.com/webpack-contrib/worker-loader/commit/2abd129a322d631caf619622cd65825699bb183a))

### [3.0.7](https://github.com/webpack-contrib/worker-loader/compare/v3.0.6...v3.0.7) (2020-12-23)


### Bug Fixes

* serializing big strings ([#304](https://github.com/webpack-contrib/worker-loader/issues/304)) ([a0de29b](https://github.com/webpack-contrib/worker-loader/commit/a0de29b497876eb462271ca5ebbeb3ffe1c1d1c4))

### [3.0.6](https://github.com/webpack-contrib/worker-loader/compare/v3.0.5...v3.0.6) (2020-12-02)


### Bug Fixes

* set a name to exported function ([#299](https://github.com/webpack-contrib/worker-loader/issues/299)) ([15cf407](https://github.com/webpack-contrib/worker-loader/commit/15cf407ad6baeb09e2cbb5d7b4b869cc63bfac7f))

### [3.0.5](https://github.com/webpack-contrib/worker-loader/compare/v3.0.4...v3.0.5) (2020-10-16)


### Bug Fixes

* determine webpack peer dependency version ([#296](https://github.com/webpack-contrib/worker-loader/issues/296)) ([8c63449](https://github.com/webpack-contrib/worker-loader/commit/8c634495419b4becc32b83e24c21e36ff720a2cd))

### [3.0.4](https://github.com/webpack-contrib/worker-loader/compare/v3.0.3...v3.0.4) (2020-10-09)

### Chore

* update `schema-utils`

### [3.0.3](https://github.com/webpack-contrib/worker-loader/compare/v3.0.2...v3.0.3) (2020-09-22)


### Bug Fixes

* remove unnecessary webpack sourceURL ([#289](https://github.com/webpack-contrib/worker-loader/issues/289)) ([eef2757](https://github.com/webpack-contrib/worker-loader/commit/eef27574160f519c344dfa5fd981b7ac561a8939))
* compatibility with eval source maps ([#286](https://github.com/webpack-contrib/worker-loader/issues/286)) ([0d4624c](https://github.com/webpack-contrib/worker-loader/commit/0d4624c178c426aa97e5175a5f321e43de482c2b))

### [3.0.2](https://github.com/webpack-contrib/worker-loader/compare/v3.0.1...v3.0.2) (2020-08-22)


### Bug Fixes

* SSR compatibility ([#284](https://github.com/webpack-contrib/worker-loader/issues/284)) ([ca4a963](https://github.com/webpack-contrib/worker-loader/commit/ca4a963e93fe5efcdf84cda0dbe571d293f079a5))

### [3.0.1](https://github.com/webpack-contrib/worker-loader/compare/v3.0.0...v3.0.1) (2020-08-05)


### Bug Fixes

* compatibility with webpack@5 cache ([#279](https://github.com/webpack-contrib/worker-loader/issues/279)) ([ee519b1](https://github.com/webpack-contrib/worker-loader/commit/ee519b1d283dbb599385fe2932c99c929b09db36))
* interpolation `[name]` for the `filename` option ([#277](https://github.com/webpack-contrib/worker-loader/issues/277)) ([5efa77a](https://github.com/webpack-contrib/worker-loader/commit/5efa77a64d8fbce123b289461234ac3a8812fb54))

## [3.0.0](https://github.com/webpack-contrib/worker-loader/compare/v2.0.0...v3.0.0) (2020-08-01)


### ⚠ BREAKING CHANGES

* minimum supported Node.js version is `10.13`
* minimum supported webpack version is `4`
* the `name` option was renamed to the `filename` option
* switch on ES module syntax by default, use the `esModule` option if you need backward compatibility with Common JS modules
* the `fallback` option was removed in favor the `inline` option, the `inline` option accepts only `fallback` and `no-fallback` values
* the `publicPath` option default value based on `output.publicPath`
* the `filename` option default value based on `output.filename`


### Features

* added the `worker` option (replaces [#178](https://github.com/webpack-contrib/worker-loader/issues/178)) ([#247](https://github.com/webpack-contrib/worker-loader/issues/247)) ([f03498d](https://github.com/webpack-contrib/worker-loader/commit/f03498d22c6a3737b724c51bdfb56627e33b57b2))
* added the `chunkFilename` option, default value based on `output.chunkFilename` ([905ed7b](https://github.com/webpack-contrib/worker-loader/commit/905ed7b028bbcb646050a1d09096dbe2fc1feb42))
* added the `esModule` option
* allow to use any web worker constructor and options for constructor
* the `publicPath` option can be `Function`
* the `filename` (previously `name`) option can be `Function`


### Bug Fixes

* support `WASM` ([152634c](https://github.com/webpack-contrib/worker-loader/commit/152634c0d8866d248ced3b6e5ac02761c978ae1a))
* respect `externals` ([#264](https://github.com/webpack-contrib/worker-loader/issues/264)) ([1e761ed](https://github.com/webpack-contrib/worker-loader/commit/1e761edcbfc8b214ae3a19f44f401f20ab07b718))
* memory leak for inline web workers ([#252](https://github.com/webpack-contrib/worker-loader/issues/252)) ([f729e34](https://github.com/webpack-contrib/worker-loader/commit/f729e342922180bf3b375a8d2ea6e1b72ca95d74))
* source maps when `inline` using without fallback ([#269](https://github.com/webpack-contrib/worker-loader/issues/269)) ([5047abb](https://github.com/webpack-contrib/worker-loader/commit/5047abb2f9b97ff4706069716df8e718bee9de43))
* the `publicPath` options works fine with async web workers chunks
* compatibility with webpack@5 ([#259](https://github.com/webpack-contrib/worker-loader/issues/259)) ([e0d9887](https://github.com/webpack-contrib/worker-loader/commit/e0d98876c6ee83bc48ea9589b38437590878e9d9))
* always use `self` as global object
* compatibility with `webpack-dev-server`
* increase performance


## [2.0.0](https://github.com/webpack-contrib/worker-loader/compare/v1.1.1...v2.0.0) (2018-05-27)

## Updates

- refactor(index): remove `Tapable.apply` calls (#121)
- docs: use ES6 import in TypeScript README example (#140)  …
- docs(README): add note about omitted hashes (`options.name`) (#131)
- fix(package): homepage URL typo (#130)

## Breaking Changes

Drops support for Webpack versions < 3.0.0

<a name="1.1.1"></a>
## [1.1.1](https://github.com/webpack-contrib/worker-loader/compare/v1.1.0...v1.1.1) (2018-02-25)


### Bug Fixes

* **index:** add `webpack >= v4.0.0` support ([#128](https://github.com/webpack-contrib/worker-loader/issues/128)) ([d1a7a94](https://github.com/webpack-contrib/worker-loader/commit/d1a7a94))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/webpack-contrib/worker-loader/compare/v1.0.0...v1.1.0) (2017-10-24)


### Features

* add `publicPath` support (`options.publicPath`) ([#31](https://github.com/webpack-contrib/worker-loader/issues/31)) ([96c6144](https://github.com/webpack-contrib/worker-loader/commit/96c6144))



<a name="1.0.0"></a>
## [1.0.0](https://github.com/webpack-contrib/worker-loader/compare/v0.8.0...v1.0.0) (2017-09-25)


### Features

* add `options` validation (`schema-utils`) ([#78](https://github.com/webpack-contrib/worker-loader/issues/78)) ([5e2f5e6](https://github.com/webpack-contrib/worker-loader/commit/5e2f5e6))
* support loading node core modules ([#76](https://github.com/webpack-contrib/worker-loader/issues/76)) ([edcda35](https://github.com/webpack-contrib/worker-loader/commit/edcda35))


### BREAKING CHANGES

* loader-utils upgrade to > 1.0 is not backwards
compatible with previous versions
