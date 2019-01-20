<div align="center">
<h1>dom-testing-library</h1>

<a href="https://www.emojione.com/emoji/1f419">
<img height="80" width="80" alt="octopus" src="https://raw.githubusercontent.com/kentcdodds/dom-testing-library/master/other/octopus.png" />
</a>

<p>Simple and complete DOM testing utilities that encourage good testing practices.</p>

[**Read the docs**](https://testing-library.com/) | [Edit the docs](https://github.com/alexkrolick/testing-library-docs)

</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-47-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]
<!-- prettier-ignore-end -->

<div align="center">
<a href="https://testingjavascript.com">
<img width="500" alt="TestingJavaScript.com Learn the smart, efficient way to test any JavaScript application." src="https://raw.githubusercontent.com/kentcdodds/dom-testing-library/master/other/testingjavascript.jpg" />
</a>
</div>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The Problem](#the-problem)
- [This Solution](#this-solution)
- [Installation](#installation)
- [Implementations](#implementations)
- [Other Solutions](#other-solutions)
- [Guiding Principles](#guiding-principles)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The Problem

You want to write maintainable tests for your Web UI. As a part of
this goal, you want your tests to avoid including implementation details of
your components and rather focus on making your tests give you the confidence
for which they are intended. As part of this, you want your testbase to be
maintainable in the long run so refactors of your components (changes to
implementation but not functionality) don't break your tests and slow you and
your team down.

## This Solution

The `dom-testing-library` is a very light-weight solution for testing DOM nodes
(whether simulated with [`JSDOM`](https://github.com/jsdom/jsdom) as provided by
default with [jest][] or in the browser). The main utilities it provides involve
querying the DOM for nodes in a way that's similar to how the user finds
elements on the page. In this way, the library helps ensure your tests give you
confidence in your UI code. The `dom-testing-library`'s primary guiding
principle is:

> [The more your tests resemble the way your software is used, the more confidence they can give you.][guiding-principle]

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev dom-testing-library
```

> [**Docs**](https://testing-library.com/docs/install)

## Implementations

This library was not built to be used on its own. The original implementation
of these utilities was in the `react-testing-library`.

Implementations include:

- [`react-testing-library`](https://github.com/kentcdodds/react-testing-library)
- [`pptr-testing-library`](https://github.com/patrickhulce/pptr-testing-library)
- [`cypress-testing-library`](https://github.com/kentcdodds/cypress-testing-library)
- [`vue-testing-library`](https://github.com/dfcook/vue-testing-library)

## Other Solutions

- [browser-monkey](https://github.com/featurist/browser-monkey)

## Guiding Principles

> [The more your tests resemble the way your software is used, the more confidence they can give you.][guiding-principle]

We try to only expose methods and utilities that encourage you to write tests
that closely resemble how your web pages are used.

Utilities are included in this project based on the following guiding
principles:

1.  If it relates to rendering components, it deals with DOM nodes rather than
    component instances, nor should it encourage dealing with component
    instances.
2.  It should be generally useful for testing the application components in the
    way the user would use it. We _are_ making some trade-offs here because
    we're using a computer and often a simulated browser environment, but in
    general, utilities should encourage tests that use the components the way
    they're intended to be used.
3.  Utility implementations and APIs should be simple and flexible.

At the end of the day, what we want is for this library to be pretty
light-weight, simple, and understandable.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt="Kent C. Dodds"/><br /><sub><b>Kent C. Dodds</b></sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=kentcdodds "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=kentcdodds "Tests") | [<img src="https://avatars1.githubusercontent.com/u/2430381?v=4" width="100px;" alt="Ryan Castner"/><br /><sub><b>Ryan Castner</b></sub>](http://audiolion.github.io)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=audiolion "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/8008023?v=4" width="100px;" alt="Daniel Sandiego"/><br /><sub><b>Daniel Sandiego</b></sub>](https://www.dnlsandiego.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=dnlsandiego "Code") | [<img src="https://avatars2.githubusercontent.com/u/12592677?v=4" width="100px;" alt="Paweł Mikołajczyk"/><br /><sub><b>Paweł Mikołajczyk</b></sub>](https://github.com/Miklet)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=Miklet "Code") | [<img src="https://avatars3.githubusercontent.com/u/464978?v=4" width="100px;" alt="Alejandro Ñáñez Ortiz"/><br /><sub><b>Alejandro Ñáñez Ortiz</b></sub>](http://co.linkedin.com/in/alejandronanez/)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=alejandronanez "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;" alt="Matt Parrish"/><br /><sub><b>Matt Parrish</b></sub>](https://github.com/pbomb)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Apbomb "Bug reports") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=pbomb "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=pbomb "Documentation") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=pbomb "Tests") | [<img src="https://avatars1.githubusercontent.com/u/1288694?v=4" width="100px;" alt="Justin Hall"/><br /><sub><b>Justin Hall</b></sub>](https://github.com/wKovacs64)<br />[📦](#platform-wKovacs64 "Packaging/porting to new platform") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars1.githubusercontent.com/u/1241511?s=460&v=4" width="100px;" alt="Anto Aravinth"/><br /><sub><b>Anto Aravinth</b></sub>](https://github.com/antoaravinth)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=antoaravinth "Code") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=antoaravinth "Tests") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=antoaravinth "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/3462296?v=4" width="100px;" alt="Jonah Moses"/><br /><sub><b>Jonah Moses</b></sub>](https://github.com/JonahMoses)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=JonahMoses "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/4002543?v=4" width="100px;" alt="Łukasz Gandecki"/><br /><sub><b>Łukasz Gandecki</b></sub>](http://team.thebrain.pro)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=lgandecki "Code") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=lgandecki "Tests") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=lgandecki "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/498274?v=4" width="100px;" alt="Ivan Babak"/><br /><sub><b>Ivan Babak</b></sub>](https://sompylasar.github.io)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Asompylasar "Bug reports") [🤔](#ideas-sompylasar "Ideas, Planning, & Feedback") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=sompylasar "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=sompylasar "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/4439618?v=4" width="100px;" alt="Jesse Day"/><br /><sub><b>Jesse Day</b></sub>](https://github.com/jday3)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=jday3 "Code") | [<img src="https://avatars0.githubusercontent.com/u/15199?v=4" width="100px;" alt="Ernesto García"/><br /><sub><b>Ernesto García</b></sub>](http://gnapse.github.io)<br />[💬](#question-gnapse "Answering Questions") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=gnapse "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=gnapse "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/2747424?v=4" width="100px;" alt="Josef Maxx Blake"/><br /><sub><b>Josef Maxx Blake</b></sub>](http://jomaxx.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=jomaxx "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=jomaxx "Documentation") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=jomaxx "Tests") |
| [<img src="https://avatars3.githubusercontent.com/u/725236?v=4" width="100px;" alt="Alex Cook"/><br /><sub><b>Alex Cook</b></sub>](https://github.com/alecook)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=alecook "Documentation") [💡](#example-alecook "Examples") | [<img src="https://avatars3.githubusercontent.com/u/10348212?v=4" width="100px;" alt="Daniel Cook"/><br /><sub><b>Daniel Cook</b></sub>](https://github.com/dfcook)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=dfcook "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=dfcook "Documentation") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=dfcook "Tests") | [<img src="https://avatars2.githubusercontent.com/u/21194045?s=400&v=4" width="100px;" alt="Thomas Chia"/><br /><sub><b>Thomas Chia</b></sub>](https://github.com/thchia)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Athchia "Bug reports") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=thchia "Code") | [<img src="https://avatars1.githubusercontent.com/u/28659384?v=4" width="100px;" alt="Tim Deschryver"/><br /><sub><b>Tim Deschryver</b></sub>](https://github.com/tdeschryver)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=tdeschryver "Code") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=tdeschryver "Tests") | [<img src="https://avatars3.githubusercontent.com/u/1571667?v=4" width="100px;" alt="Alex Krolick"/><br /><sub><b>Alex Krolick</b></sub>](https://alexkrolick.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=alexkrolick "Code") | [<img src="https://avatars2.githubusercontent.com/u/2224291?v=4" width="100px;" alt="Maddi Joyce"/><br /><sub><b>Maddi Joyce</b></sub>](http://www.maddijoyce.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=maddijoyce "Code") | [<img src="https://avatars1.githubusercontent.com/u/25429764?v=4" width="100px;" alt="Peter Kamps"/><br /><sub><b>Peter Kamps</b></sub>](https://github.com/npeterkamps)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Anpeterkamps "Bug reports") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=npeterkamps "Code") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=npeterkamps "Tests") |
| [<img src="https://avatars2.githubusercontent.com/u/21689428?v=4" width="100px;" alt="Jonathan Stoye"/><br /><sub><b>Jonathan Stoye</b></sub>](http://jonathanstoye.de)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=JonathanStoye "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/4126644?v=4" width="100px;" alt="Sanghyeon Lee"/><br /><sub><b>Sanghyeon Lee</b></sub>](https://github.com/yongdamsh)<br />[💡](#example-yongdamsh "Examples") | [<img src="https://avatars3.githubusercontent.com/u/8015514?v=4" width="100px;" alt="Justice Mba "/><br /><sub><b>Justice Mba </b></sub>](https://github.com/Dajust)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=Dajust "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=Dajust "Documentation") [🤔](#ideas-Dajust "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/340761?v=4" width="100px;" alt="Wayne Crouch"/><br /><sub><b>Wayne Crouch</b></sub>](https://github.com/wgcrouch)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=wgcrouch "Code") | [<img src="https://avatars1.githubusercontent.com/u/4996462?v=4" width="100px;" alt="Ben Elliott"/><br /><sub><b>Ben Elliott</b></sub>](http://benjaminelliott.co.uk)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=benelliott "Code") | [<img src="https://avatars3.githubusercontent.com/u/577921?v=4" width="100px;" alt="Ruben Costa"/><br /><sub><b>Ruben Costa</b></sub>](http://nuances.co)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=rubencosta "Code") | [<img src="https://avatars2.githubusercontent.com/u/4982001?v=4" width="100px;" alt="Robert Smith"/><br /><sub><b>Robert Smith</b></sub>](http://rbrtsmith.com/)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Arbrtsmith "Bug reports") [🤔](#ideas-rbrtsmith "Ideas, Planning, & Feedback") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=rbrtsmith "Documentation") |
| [<img src="https://avatars3.githubusercontent.com/u/881986?v=4" width="100px;" alt="dadamssg"/><br /><sub><b>dadamssg</b></sub>](https://github.com/dadamssg)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=dadamssg "Code") | [<img src="https://avatars1.githubusercontent.com/u/186971?v=4" width="100px;" alt="Neil Kistner"/><br /><sub><b>Neil Kistner</b></sub>](https://neilkistner.com/)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=wyze "Code") | [<img src="https://avatars3.githubusercontent.com/u/1448597?v=4" width="100px;" alt="Ben Chauvette"/><br /><sub><b>Ben Chauvette</b></sub>](http://bdchauvette.net/)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=bdchauvette "Code") | [<img src="https://avatars2.githubusercontent.com/u/777527?v=4" width="100px;" alt="Jeff Baumgardt"/><br /><sub><b>Jeff Baumgardt</b></sub>](https://github.com/JeffBaumgardt)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=JeffBaumgardt "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=JeffBaumgardt "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/4658208?v=4" width="100px;" alt="Matan Kushner"/><br /><sub><b>Matan Kushner</b></sub>](http://matchai.me)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=matchai "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=matchai "Documentation") [🤔](#ideas-matchai "Ideas, Planning, & Feedback") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=matchai "Tests") | [<img src="https://avatars2.githubusercontent.com/u/5779538?v=4" width="100px;" alt="Alex Wendte"/><br /><sub><b>Alex Wendte</b></sub>](http://www.wendtedesigns.com/)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=themostcolm "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=themostcolm "Documentation") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=themostcolm "Tests") | [<img src="https://avatars0.githubusercontent.com/u/2196208?v=4" width="100px;" alt="Tamas Fodor"/><br /><sub><b>Tamas Fodor</b></sub>](https://github.com/ruffle1986)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=ruffle1986 "Documentation") |
| [<img src="https://avatars3.githubusercontent.com/u/14793495?v=4" width="100px;" alt="Benjamin Eckardt"/><br /><sub><b>Benjamin Eckardt</b></sub>](https://github.com/BenjaminEckardt)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=BenjaminEckardt "Code") | [<img src="https://avatars3.githubusercontent.com/u/205752?v=4" width="100px;" alt="Ryan Campbell"/><br /><sub><b>Ryan Campbell</b></sub>](https://github.com/campbellr)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=campbellr "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/1335519?v=4" width="100px;" alt="Taylor Briggs"/><br /><sub><b>Taylor Briggs</b></sub>](https://taylor-briggs.com)<br />[⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=TaylorBriggs "Tests") | [<img src="https://avatars2.githubusercontent.com/u/132233?v=4" width="100px;" alt="John Gozde"/><br /><sub><b>John Gozde</b></sub>](https://github.com/jgoz)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=jgoz "Code") | [<img src="https://avatars2.githubusercontent.com/u/3382565?v=4" width="100px;" alt="C. T. Lin"/><br /><sub><b>C. T. Lin</b></sub>](https://github.com/chentsulin)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=chentsulin "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/5312329?v=4" width="100px;" alt="Terrence Wong"/><br /><sub><b>Terrence Wong</b></sub>](http://terrencewwong.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=terrencewwong "Code") | [<img src="https://avatars0.githubusercontent.com/u/12230408?v=4" width="100px;" alt="Soo Jae Hwang"/><br /><sub><b>Soo Jae Hwang</b></sub>](https://www.ossfinder.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=misoguy "Code") |
| [<img src="https://avatars0.githubusercontent.com/u/19773?v=4" width="100px;" alt="Royston Shufflebotham"/><br /><sub><b>Royston Shufflebotham</b></sub>](https://github.com/RoystonS)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3ARoystonS "Bug reports") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=RoystonS "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=RoystonS "Documentation") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=RoystonS "Tests") | [<img src="https://avatars0.githubusercontent.com/u/591673?v=4" width="100px;" alt="Vadim Brodsky"/><br /><sub><b>Vadim Brodsky</b></sub>](http://www.vadimbrodsky.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=VadimBrodsky "Code") | [<img src="https://avatars3.githubusercontent.com/u/499898?v=4" width="100px;" alt="Eunjae Lee"/><br /><sub><b>Eunjae Lee</b></sub>](https://twitter.com/eunjae_lee)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=eunjae-lee "Code") | [<img src="https://avatars2.githubusercontent.com/u/167743?v=4" width="100px;" alt="David Peter"/><br /><sub><b>David Peter</b></sub>](http://davidpeter.me)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=sarenji "Code") | [<img src="https://avatars0.githubusercontent.com/u/13174025?v=4" width="100px;" alt="Shy Alter"/><br /><sub><b>Shy Alter</b></sub>](https://twitter.com/@puemos)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=puemos "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=puemos "Documentation") |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/dom-testing-library.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/dom-testing-library
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/dom-testing-library.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/dom-testing-library
[version-badge]: https://img.shields.io/npm/v/dom-testing-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/dom-testing-library
[downloads-badge]: https://img.shields.io/npm/dm/dom-testing-library.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/dom-testing-library
[license-badge]: https://img.shields.io/npm/l/dom-testing-library.svg?style=flat-square
[license]: https://github.com/kentcdodds/dom-testing-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/dom-testing-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/dom-testing-library.svg?style=social
[github-watch]: https://github.com/kentcdodds/dom-testing-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/dom-testing-library.svg?style=social
[github-star]: https://github.com/kentcdodds/dom-testing-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20dom-testing-library%20by%20%40kentcdodds%20https%3A%2F%2Fgithub.com%2Fkentcdodds%2Fdom-testing-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/dom-testing-library.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[set-immediate]: https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate
[guiding-principle]: https://twitter.com/kentcdodds/status/977018512689455106
[data-testid-blog-post]: https://blog.kentcdodds.com/making-your-ui-tests-resilient-to-change-d37a6ee37269
[jest]: https://facebook.github.io/jest
