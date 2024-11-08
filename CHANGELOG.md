# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/doralteres/express-sequelize-autocrud/compare/v1.1.1...v1.2.0) (2024-11-05)


### Features

* :sparkles: support byField in update and delete routes ([5567b4c](https://github.com/doralteres/express-sequelize-autocrud/commit/5567b4c81c1a7cd9f9b4481be2f58b5887b6c177))

## [1.1.1](https://github.com/doralteres/express-sequelize-autocrud/compare/v1.1.0...v1.1.1) (2024-02-04)


### Bug Fixes

* fix log messages in bulkCreate ([c639a1f](https://github.com/doralteres/express-sequelize-autocrud/commit/c639a1f1d07445afb361f40baa136d967b8ba651))

## [1.1.0](https://github.com/doralteres/express-sequelize-autocrud/compare/v1.0.0...v1.1.0) (2024-02-03)


### Features

* ✨ add bulkCreate route ([#38](https://github.com/doralteres/express-sequelize-autocrud/issues/38)) ([7607fe9](https://github.com/doralteres/express-sequelize-autocrud/commit/7607fe9fb806390bd616d004c791e17e94d9d08c))

## [1.0.0](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.2.0...v1.0.0) (2024-01-28)


### ⚠ BREAKING CHANGES

* min node version -> 16, only works on es modules

### Features

* :lipstick: add custom loggger option ([cbd4dfe](https://github.com/doralteres/express-sequelize-autocrud/commit/cbd4dfe7ecea43c18919f924b82cf0aaa1b5b26a))
* :lipstick: add get List route ([8f52771](https://github.com/doralteres/express-sequelize-autocrud/commit/8f527715244bebe3c1badd910ecf3a12817bfafa))
* :rocket: add create route ([d6e790b](https://github.com/doralteres/express-sequelize-autocrud/commit/d6e790b62143de6556689ec23b9943d291d99bcd))
* :rocket: add getOne route ([f8b7ae9](https://github.com/doralteres/express-sequelize-autocrud/commit/f8b7ae9d9b161c73c58c03f533ea849cd7ff23bd))
* :sparkles: add content-range header on getList routes ([6805c8f](https://github.com/doralteres/express-sequelize-autocrud/commit/6805c8f279df248e11f387d8c9ea9e8f18c93ea0))
* :sparkles: add custom routes feature ([073a25b](https://github.com/doralteres/express-sequelize-autocrud/commit/073a25bc71b26db06ca0a59733ab5865d72519e0))
* :sparkles: add delete route ([8f5beb4](https://github.com/doralteres/express-sequelize-autocrud/commit/8f5beb4cb06f0630e9d767b08c40b3b4910877fa))
* :sparkles: add middleware function for getList ([66b9833](https://github.com/doralteres/express-sequelize-autocrud/commit/66b9833c18aa75fe5eba66262cf20f78db27a06e))
* :sparkles: add Update route ([7b162ec](https://github.com/doralteres/express-sequelize-autocrud/commit/7b162ecb0334496cecc02c3ee54fccab00f1ecc0))
* ✨ add option to use findOne instead of findByPk ([#33](https://github.com/doralteres/express-sequelize-autocrud/issues/33)) ([375797e](https://github.com/doralteres/express-sequelize-autocrud/commit/375797e2ab09ef6c11a44f0cdb0c1bf0e09b4dfd))
* add custom middleware functionallity ([b9d25b8](https://github.com/doralteres/express-sequelize-autocrud/commit/b9d25b8d079d7425600443f01280b85289ccf26d))
* add default values to crudOptions ([3537deb](https://github.com/doralteres/express-sequelize-autocrud/commit/3537deb997522a39bbbd8f8f491b84406e981ef0))


### Bug Fixes

* :bug: export all types in root module ([dd88046](https://github.com/doralteres/express-sequelize-autocrud/commit/dd880467f7ef6b8f286084596e9f6f10a082582b))
* :bug: fix transaction override issue (ts) ([bcbb88d](https://github.com/doralteres/express-sequelize-autocrud/commit/bcbb88dea71a14866537607222cb6720c256ac2d))
* :bug: transaction issue in update route ([07d9529](https://github.com/doralteres/express-sequelize-autocrud/commit/07d9529c7feb9f88dd19fe4a8ee228b259c346f2))
* :bug: undefine issue in query params ([d04e6af](https://github.com/doralteres/express-sequelize-autocrud/commit/d04e6af597881d4b35496738739cc0f2e12f1419))
* :lock: add transaction feature to create, update & delete routes ([e742256](https://github.com/doralteres/express-sequelize-autocrud/commit/e742256a1416d010f3cc658cd4717352d2cc2dec))
* path key issues ([45e72c4](https://github.com/doralteres/express-sequelize-autocrud/commit/45e72c45934a1e154d9e96df351ca9db0626135c))


### Performance Improvements

* :white_check_mark: add unit tests using vitest ([54fe88b](https://github.com/doralteres/express-sequelize-autocrud/commit/54fe88b71a1e25e495a622de3bc0df652bb13477))
* :zap: better error handling ([f7f7939](https://github.com/doralteres/express-sequelize-autocrud/commit/f7f7939f878bd328769ae0b47e40d95af8210e99))


### Miscellaneous Chores

* release 0.3.0 ([ec38bea](https://github.com/doralteres/express-sequelize-autocrud/commit/ec38bea3f5545bab2d5f715f851d8701be5d8584))
* release 1.0.0 ([adb1b5b](https://github.com/doralteres/express-sequelize-autocrud/commit/adb1b5b00ced7bb38510544c78f9393705f0ab50))


### Code Refactoring

* :art: move to esm ([76d826b](https://github.com/doralteres/express-sequelize-autocrud/commit/76d826bff447e1873226fec931e1391a9de1803c))

## [0.2.0](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.1.0...v0.2.0) (2024-01-27)


### Features

* ✨ add option to use findOne instead of findByPk ([#33](https://github.com/doralteres/express-sequelize-autocrud/issues/33)) ([375797e](https://github.com/doralteres/express-sequelize-autocrud/commit/375797e2ab09ef6c11a44f0cdb0c1bf0e09b4dfd))

## [0.1.0](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.14...v0.1.0) (2023-12-17)


### ⚠ BREAKING CHANGES

* min node version -> 16, only works on es modules

* :art: move to esm ([76d826b](https://github.com/doralteres/express-sequelize-autocrud/commit/76d826bff447e1873226fec931e1391a9de1803c))

### [0.0.14](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.13...v0.0.14) (2023-10-14)


### Features

* :lipstick: add custom loggger option ([cbd4dfe](https://github.com/doralteres/express-sequelize-autocrud/commit/cbd4dfe7ecea43c18919f924b82cf0aaa1b5b26a))

### [0.0.13](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.12...v0.0.13) (2023-10-11)


### Bug Fixes

* :bug: transaction issue in update route ([07d9529](https://github.com/doralteres/express-sequelize-autocrud/commit/07d9529c7feb9f88dd19fe4a8ee228b259c346f2))

### [0.0.12](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.11...v0.0.12) (2023-10-08)

### [0.0.11](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.10...v0.0.11) (2023-09-21)


### Bug Fixes

* :bug: undefine issue in query params ([d04e6af](https://github.com/doralteres/express-sequelize-autocrud/commit/d04e6af597881d4b35496738739cc0f2e12f1419))

### [0.0.10](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.9...v0.0.10) (2023-09-21)


### Features

* :sparkles: add custom routes feature ([073a25b](https://github.com/doralteres/express-sequelize-autocrud/commit/073a25bc71b26db06ca0a59733ab5865d72519e0))

### [0.0.9](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.8...v0.0.9) (2023-09-18)


### Features

* add default values to crudOptions ([3537deb](https://github.com/doralteres/express-sequelize-autocrud/commit/3537deb997522a39bbbd8f8f491b84406e981ef0))

### [0.0.8](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.7...v0.0.8) (2023-09-08)


### Features

* :sparkles: add content-range header on getList routes ([6805c8f](https://github.com/doralteres/express-sequelize-autocrud/commit/6805c8f279df248e11f387d8c9ea9e8f18c93ea0))

### [0.0.7](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.6...v0.0.7) (2023-09-07)


### Bug Fixes

* :bug: export all types in root module ([dd88046](https://github.com/doralteres/express-sequelize-autocrud/commit/dd880467f7ef6b8f286084596e9f6f10a082582b))
* :bug: fix transaction override issue (ts) ([bcbb88d](https://github.com/doralteres/express-sequelize-autocrud/commit/bcbb88dea71a14866537607222cb6720c256ac2d))

### [0.0.6](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.5...v0.0.6) (2023-09-07)


### Bug Fixes

* :lock: add transaction feature to create, update & delete routes ([e742256](https://github.com/doralteres/express-sequelize-autocrud/commit/e742256a1416d010f3cc658cd4717352d2cc2dec))

### [0.0.5](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.4...v0.0.5) (2023-09-06)


### Features

* :sparkles: add delete route ([8f5beb4](https://github.com/doralteres/express-sequelize-autocrud/commit/8f5beb4cb06f0630e9d767b08c40b3b4910877fa))
* :sparkles: add Update route ([7b162ec](https://github.com/doralteres/express-sequelize-autocrud/commit/7b162ecb0334496cecc02c3ee54fccab00f1ecc0))

### [0.0.4](https://github.com/doralteres/express-sequelize-autocrud/compare/v0.0.3...v0.0.4) (2023-09-06)


### Features

* :lipstick: add get List route ([8f52771](https://github.com/doralteres/express-sequelize-autocrud/commit/8f527715244bebe3c1badd910ecf3a12817bfafa))
* :rocket: add create route ([d6e790b](https://github.com/doralteres/express-sequelize-autocrud/commit/d6e790b62143de6556689ec23b9943d291d99bcd))
* :rocket: add getOne route ([f8b7ae9](https://github.com/doralteres/express-sequelize-autocrud/commit/f8b7ae9d9b161c73c58c03f533ea849cd7ff23bd))
* :sparkles: add middleware function for getList ([66b9833](https://github.com/doralteres/express-sequelize-autocrud/commit/66b9833c18aa75fe5eba66262cf20f78db27a06e))
* add custom middleware functionallity ([b9d25b8](https://github.com/doralteres/express-sequelize-autocrud/commit/b9d25b8d079d7425600443f01280b85289ccf26d))


### Bug Fixes

* path key issues ([45e72c4](https://github.com/doralteres/express-sequelize-autocrud/commit/45e72c45934a1e154d9e96df351ca9db0626135c))

### 0.0.3 (2023-08-27)

### 0.0.2 (2023-08-27)
