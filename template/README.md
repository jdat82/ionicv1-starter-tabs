
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Quick readers](#quick-readers)
- [Prerequisites](#prerequisites)
- [Features](#features)
  - [Build](#build)
- [Conventions](#conventions)
  - [Build](#build-1)
  - [Javascript](#javascript)
    - [General](#general)
    - [Angular](#angular)
  - [CSS](#css)
    - [SASS](#sass)
    - [BEM](#bem)
- [High-level npm comands](#high-level-npm-comands)
  - [In case you don't know](#in-case-you-dont-know)
  - [npm run serve](#npm-run-serve)
  - [npm run android](#npm-run-android)
  - [npm run android-lr](#npm-run-android-lr)
  - [npm run ios](#npm-run-ios)
  - [npm run ios-lr](#npm-run-ios-lr)
  - [npm test or npm run test-local](#npm-test-or-npm-run-test-local)
  - [npm run test-local-w](#npm-run-test-local-w)
  - [npm run doc](#npm-run-doc)
  - [npm run doctoc](#npm-run-doctoc)
  - [npm run build [-- \<platform>]](#npm-run-build----%5Cplatform)
- [Build](#build-2)
  - [Grunt options](#grunt-options)
    - [--proxy | --no-proxy](#--proxy----no-proxy)
    - [--mock | --no-mock](#--mock----no-mock)
    - [--patterns <name>](#--patterns-name)
    - [--platform <name>](#--platform-name)
- [Serving changes](#serving-changes)
  - [In your browser](#in-your-browser)
  - [On device](#on-device)
    - [Without livereload support](#without-livereload-support)
    - [With livereload support](#with-livereload-support)
- [Tests](#tests)
  - [Unit tests](#unit-tests)
- [Error handling](#error-handling)
  - [Err class](#err-class)
  - [Default angular handler](#default-angular-handler)
- [Splashscreen reflexions](#splashscreen-reflexions)
- [Release process](#release-process)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Overview

Starter project for IONIC v1.

# Quick readers

<u>Quick readers can do `npm start` in order to test it quickly:</u>

- Install node dependencies (npm)
- Install javascript dependencies (bower)
- Build project
- Launch a web server with reverse proxy and livereload
- Open app in default browser

I do not recommend to develop in the browser. It is different than a real device. You should develop on a real device and use the browser 
solution when it makes sense to make your life simpler for particular cases.

In order to test in a simulator/emulator/device, you will need first to install everything needed by cordova and ionic (sdk, emulators, etc.) 
and then hit `ionic state restore` in your terminal which will install all cordova platforms and plugins. See [prerequisites](#prerequisites) section.

Then you just need to use one of the predefined npm alias. See [High level npm commands](#high-level-npm-comands). For instance: `npm run android`.

<u>So to resume:</u>

```bash
# Desktop browser
npm start 

# OR device/emulator/simulator
npm install
ionic state reset
npm run <ios|android|ios-lr|android-lr>
```

# Prerequisites

Cordova, Ionic, Bower and Grunt should be installed globally, they will delegate to a local instance if any:

```bash
npm i -g cordova ionic bower grunt-cli
```

iOS deployment tools should also be installed globally as recommended by Ionic for practical reasons too:

```bash
npm i -g ios-sim ios-deploy
```

XCode should be installed from the Mac App Store and launched at least once.

Android Studio and sdk should be installed. Android tools should be in path.
You may install and configure emulator images if you want to run this project in an emulator.

JDK 7 (or more recent) should be installed.

This project should work on all versions of node since 0.12.7. I recommend [NVM](https://github.com/creationix/nvm) for simple and powerful node management.

# Features  

## Build

- Complete build powered by grunt and npm:
    - CSS: 
        - SASS compilation
        - Auto imports of SASS partials
        - Auto prefixing of css vendors (code is easier to read and write)
    - Javascript:
        - Concatenation and minification
        - Angular annotations for dependency injection (avoid us to use annotations or the array notation - code is easier to read and write)
    - JADE:
        - Templates compilation as a javascript bundle (avoid to compile templates at runtime)
    - Quality:
        - JSHINT: analyse structure 
        - JSCS: analyse form
    - Release:
        - Version bumping 
        - Changelog generation
    - Doc:
        - GROC: to read existing code easily
        - PLATO: sonar light to anaylyse code quality
    - Watchers for css, javascript and templates
    - Unit tests: local in phantomjs
    - Simple and very readable declaration of grunt aliases via the YAML file `grunt/aliases.yaml`
    - Pattern replacements in any file based on context (`conf/` folder)

# Conventions

## Build

This project uses [Grunt](http://gruntjs.com/) as a task manager. Grunt tasks are lazy-loaded for performance.
Tasks are defined inside `grunt` folder. There is one file per type of task. For instance, `css.js` contains css related tasks. 
It allows to have all related tasks in one file without having a too bigger file. 
I found it to be a good compromise between the one-file-per-task and one-big-monolithic-file strategies.

Grunt is used essentially to build web code and start tools.

## Javascript

### General

This project is using jshint (see `.jshintrc`) and jscs (see `.jscsrc`) to validate both form and content.

### Angular

This project tries to respect [guidelines from Angular team](https://github.com/johnpapa/angular-styleguide).

I recommand to use super easy and known optimisations like:

- [One-time binding](https://code.angularjs.org/1.4.8/docs/guide/expression) 
- [track-by expressions](https://code.angularjs.org/1.4.8/docs/api/ng/directive/ngRepeat)
- [Disabling debug data](https://code.angularjs.org/1.4.8/docs/guide/production#disabling-debug-data)
- [Enabling animations explicitly](http://www.bennadel.com/blog/2935-enable-animations-explicitly-for-a-performance-boost-in-angularjs.htm)
- [Using applyAsync](http://blog.thoughtram.io/angularjs/2015/01/14/exploring-angular-1.3-speed-up-with-applyAsync.html)
- …

An hybrid app should be very optimized (especially when there is animations) regarding today browser performances which are a lot inferior
to native code. It means also each functionality should be judged with caution in regard of added value, code complexity and performance. 
Plus while animating (with css), nothing else should be running (javascript). 

## CSS

### SASS

`SASS` is used to build upon Ionic SASS code and allow easy UI customisations. 

`_ionic.app.scss` is reserved for ionic customization like when we want to override default colors, or default font sizes, etc.

`_layout.scss` should contain transverse layout definitions.

`app.scss` is our entry point. You probably will never have to modify it. It is responsible to import everything else.

When writing a new scss file for a component you should always prefix it with `_` so we know it is a partial. This is convention in sass world. All partials are automatically imported by `app.scss` when building. See `grunt/css.js`.

### BEM

I always liked css object oriented features but they come with the cost of performance and maintainability.
I recommend to use a [BEM custom approach](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) which seems to be a good compromise :

- better performance because there is less levels of imbrication
- better maintainability and readability
- less regressions and complications when working with other developers

Nonetheless, it is not a religion and normal css selectors should be used [when it makes sense](http://cssguidelin.es/#bem-like-naming). 

# High-level npm comands

The file `package.json` contains a list of useful alias that you can invoke with `npm run <alias>`.

## In case you don't know

Ionic comes with some very useful tools. Essentially it allows three differents way to test and deploy your code :

- Start a web server with optional proxy support and then deploy in a browser
  - which means your code is served via a web server loaded from `http://localhost:8100`
- Deploy in a real device (or a simulator/emulator if none)
  - which means your code is copied on device and loaded from a `file://` url
- Deploy in a real device (or a simulator/emulator if none) in livereload mode
  - which means your code is served via a web server
  - your code is loaded from `http://<ip>:8100` even though your are on a real device

> WARNING: if I'm not mistaken, ionic built-in proxy is not working behind a corporate proxy.
> For myself, I'm working either on wifi or on a local network made with my mobile.

The following npm commands are wrapper around ionic and cordova commands. 
Il simplifies day-to-day job but allows nonetheless to use direct ionic or cordova commands when needed.


## npm run serve

- Build project with cordova mocks and proxy support
- Serve the app in default browser

You may pass a `--lab` option as it will delegate to `ionic serve` internally:
```bash
npm run serve -- --lab
```

## npm run android

- Build web code
- Build native code 
- Deploy to android device (emulator if none)

## npm run android-lr

- Build web code with proxy support
- Build native code
- Start a watcher for web code
- Start a web server with proxy
- Deploy to android device (emulator if none) in livereload mode

## npm run ios

- Build web code 
- Build native code 
- Deploy to ios device (simulator if none)

## npm run ios-lr

- Build web project with proxy support
- Build native code 
- Start a watcher for web code
- Start a web server with proxy
- Deploy to ios device (simulator if none) in livereload mode

## npm test or npm run test-local

- Build web project with cordova mocks support
- Execute unit tests with karma in a PhantomJS container
- Generate JUnit and Coverage reports

## npm run test-local-w

- Build web project with cordova mocks support
- Start a watcher for app code
- Execute unit tests with karma in a Chrome container and watch for changes in test code
- It means changes to code (tests and app) are taken into account live
- JUnit and Coverage reporters disabled
- Debug possible via Chrome DevTools
- Nice html report in debug window

## npm run doc

- Generate [groc](https://github.com/nevir/groc) and [plato](https://github.com/es-analysis/plato) documentation.

## npm run doctoc

- To update Table Of Content (TOC) inside `README.md`.

## npm run build [-- \<platform>]

If you simply want to build code without mocks/proxy/livereload options.

- Build web code
- Build native code

# Build

Project is built inside `www`.

Just hit `grunt dev` to build the whole project for development.

To reduce build time, you can use `grunt` or `grunt newdev` to build only what changed since last build.

`grunt dist` will build with distribution options.

I almost never use low-level grunt tasks. I prefer to use npm high-level tasks. But it is good to understand how it works.

## Grunt options

### --proxy | --no-proxy

Instrument `conf/dev.js`: change API endpoint and enable the livereload option in order to leverage a reverse proxy on the local machine.

Make sense when serving code via a web server :

- `npm run serve`
- `npm run <platform>-lr`

### --mock | --no-mock

Instrument `conf/dev.js`: enable ngCordova mocks.

Make sense when serving code in a browser :

- `npm run serve`

### --patterns <name>

Define which file from `conf/` will be used as source of patterns. These patterns will be used to make replacements in source files.
See [grunt-replace](https://github.com/outaTiME/grunt-replace).

For instance: `grunt dev --patterns foo` would use `conf/foo.js`.

### --platform <name>

Define which platform is currently built. May be useful if you want to do something for a specific platform like adding or removing a library… 

For instance: `grunt dev --platform windows`

## Instrument code based on context

We just saw the `--patterns` grunt option allows to choose a set of patterns. There is two default sets: `dev` & `dist`.

The first way to instrument code is by using the `@@` syntax. It allows to insert any variable in any file like that:

```jade
meta(http-equiv='Content-Security-Policy', content="@@csp")
```

As an alternative, in javascript files, I prefer to declare a constant using that variable in `app.constant.js` and then inject it in my angular components.
I recommend to do it that way for javascript files in order to respect the dependency injection paradigm which is used every where in angular notably in unit tests.

```javascript
// Backend endpoint
app.constant('apiEndpoint', '@@apiEndpoint');

…

// Restangular configuration
function setRestConfig(Restangular, apiEndpoint) {
	…
}
```

## Grunt tasks

There is one `gruntfile.js` in the root ; then everything else grunt related is inside `grunt` folder. Each file groups several grunt tasks per type.

Temporary file instrumentation is done inside `.tmp`.

Target files are generated or copied to cordova `www` folder. That folder is emptied before each build and should not contain versionned source code.

### `aliases.yaml`

Define grunt aliases the easy way. There is 3 default aliases. More on than later. For novices, a grunt alias is just a task invoking a set of tasks.

### `grunt/css.js`

SASS files are imported into `_partials.scss` and then compiled into app.css. PostCSS allows us to instrument this generated file to add and remove vendor prefixes based on our scope (which browser we want to support). 

### `grunt/script.js`

Angular functions eligible to dependency injection are rewritten to use the array notation in order to be compatible with minification. Code is contactenated and eventually minified (in production mode). 

### `grunt/template.js`

Compile jade templates as either html file or javascript angular module. Either case, not jade compilation is made at runtime.

### `grunt/quality.js`

Analyse javascript files content (semantics and style).

### `grunt/dist.js`

Task related to the release process. Initialized with basic tools. May highly from one project to another.

### `grunt/doc.js`

Groc might be handy when discovering code written by others. Plato is a simple solution to get some insights about code quality. Less evolved than SONAR.

### `grunt/serve.js`

Utility grunt tasks to launch in parallel several tools. Default chokidar configuration.

> Each file in `grunt/` folder may contain a chokidar task which is responsible to watch files for changes. 
I prefer to put them near the related tasks because it makes more sense and is easier to debug.

### `grunt/test.js`

Karma configuration.

### `grunt/assets.js`

Copy static files.

### `grunt/common.js`

Everything else like patterns replacement or cleaning.


# Serving changes

> WARNING: if I'm not mistaken, ionic built-in proxy is not working behind a corporate proxy.

## In your browser

To build, launch a local web server and watch for changes:

```bash
npm run serve
```

You may pass a `--lab` option as it will delegate to `ionic serve` internally:

```bash
npm run serve -- --lab
```

Code is loaded from `http://localhost:8100`.

## On device

To build and deploy on device (or simulator if any):

```bash
npm run <platform>
```

> Some people experience a little bug when deploying on iOS (in ios-deploy I guess) the first time: simulator doesn't show up. 
Second call works though. 

### Without livereload support

Allowed `platform` values:

- `android`
- `ios`

Code is loaded from `file://assets/index.html`.

### With livereload support

You may use instead:

- `android-lr`
- `ios-lr`

It will also start a watcher for code changes and the built-in ionic web server in livereload mode.

Code is loaded from `http://<your ip>:8100`.

See npm scripts in `package.json` and [IONIC CLI](http://ionicframework.com/docs/cli/test.html) to have a better understanding.

# Tests

## Unit tests

Unit tests are run by Karma and written with Jasmine.

To launch unit tests locally in a PhantomJS container:

```bash
npm run test-local
# Equivalent to `npm test`
```

- JUnit reports are generated inside `doc/test/junit`
- Coverage reports are generated with Istanbul inside `doc/test/coverage` (used also by codecov.io)

To launch unit tests locally in a Chrome container in debug mode and watch for changes:

```bash
npm run test-local-w
```

JUnit and coverage reports are disabled.

# Error handling

## Err class

Error codes should be defined in `err.factory.js`. 

`Err` is a class that inherits the standard javascript `Error` class in order to add new attributes like `code`. 
Its message is automatically defined based on its code but it is possible to override that message. You may also give it a cause.

To create a new error, you can do:

```javascript
// if 1000 is an an existing error code, its message will be found automatically.
if(condition) throw new Err(1000);   
    
// You can also pass options like a source error or a specific hardcoded message.
throw new Err(1000, {source: err, message: 'my hardcoded message'});

// You may also set the `ui` flag to true in order to inform the default handler it can safely print that error to the user.
throw new Err(1000, {ui:true});
```

## Default angular handler

Angular default error handler, a.k.a `$exceptionHandler` was decorated to show a native toast in last resort. If the received err is an instance of `Err` and `ui` is set to `true` its `message` attribute is used. 

**Concerning chains of promises, you should follow some rules:**

- the one ending a chain of promises is responsible in case of rejection to throw an exception if pertinent in order to trigger `$exceptionHandler`. 
Indeed, in `$q` angular implementation, contrary to `Q` there is no `done` function to catch uncaught rejected promises.  

- the one throwing an exception should throw an instance of `Err` with at least a code. 

- In order to buy time and code less, you might want to reuse `throwErr` injectable function.

```javascript
return countryLanguageService.allCountries().then(function (response) {
	vm.countries = response.data;
}).catch(showErr); 

////////

function showErr(err){
    if( I can handle that error) do something
    else throwErr(err);
}
```

To resume, if you do not have any error handling to do in one of your component, you should at least use `throwErr` so generic errors are being handled by $exceptionHandler`.

```javascript
return countryLanguageService.allCountries().then(function (response) {
	vm.countries = response.data;
}).catch(throwErr); // throwErr is injectable via DI
```

# Splashscreen reflexions

I do not recommend to auto hide the splashscreen. Depending on your device velocity the splashscreen may hide itself before the webview is visible. This is what happens on Android:

1. Black screen (which is your app's background)
1. Show Splashscreen then hide after delay
1. Reveal what is behind, so depending on device, it may be :

- still a black screen
- your webview

Augmenting the delay may be a solution if you didn't set preference `SplashShowOnlyFirstTime` to false. It is not very pretty though.
 
I recommend to either hide the splashscreen yourself when you are ready or use a very basic native splashscreen (one color) and then a web splashscreen. A web splashscreen allows much more flexibility and creativity but is more expensive.

> Warning: [the plugin splashscreen is broken in version 3.0.0 and 3.1.0](https://issues.apache.org/jira/browse/CB-10412?jql=project%20%3D%20CB%20AND%20status%20in%20(Open%2C%20%22In%20Progress%22%2C%20Reopened)%20AND%20resolution%20%3D%20Unresolved%20AND%20component%20%3D%20%22Plugin%20Splashscreen%22%20AND%20text%20~%20%22hide%22%20ORDER%20BY%20priority%20DESC%2C%20summary%20ASC%2C%20updatedDate%20DESC): you can't hide the splashscreen yourself.

I don't know a cordova way to customize the app's default background, but by modifying the code of each shell and defining a custom background color in adequation with your look it can be even prettier. I don't like modifying native code though.
 
# Release process

I prefer not to automate more than that in order to have control after each step. But it would be easy to make an npm script.

```bash
# 1. Modify package.json and config.xml
grunt bump-only[:<patch|minor|major|…>]
# 2. Generate changelog
grunt conventionalChangelog
# 3. Commit, create tag and push to origin (including tags)
grunt commit-only
```

Regarding changelog generation, you may want to use [these conventions](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md). 
I recommend to follow solid conventions like the one used by the Angular or IONIC team which have proven to work. 
Plus they are handled by the `conventional-changelog` plugin natively.   

The `conventionalChangelog` plugin is modular enough to allow customization in case you don't want or can't use these conventions.
There is an example inside `grunt/dist.js` in [this demo app repository](https://github.com/jdat82/learning-ionic).

# Known bugs
 
- Livereload mode breaks images first time they are put in cache (`file://` url is used in place of `cdvfile://` url)
- Cordova plugin `google-analytics-plugin` has been updated during summer with **not so smart** breaking changes in the API. Waiting for `ngCordova` to be updated.
  - This results in GA calls working but reported as errors