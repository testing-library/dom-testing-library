<div align="center">
<h1>DOM Testing Library</h1>

<a href="https://www.emojione.com/emoji/1f419">
  <img
    height="80"
    width="80"
    alt="octopus"
    src="https://raw.githubusercontent.com/testing-library/dom-testing-library/master/other/octopus.png"
  />
</a>

<p>Simple and complete DOM testing utilities that encourage good testing
practices.</p>

[**Read the docs**](https://testing-library.com/) |
[Edit the docs](https://github.com/testing-library/testing-library-docs)

</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-76-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]
<!-- prettier-ignore-end -->

<div align="center">
  <a href="https://testingjavascript.com">
    <img
      width="500"
      alt="TestingJavaScript.com Learn the smart, efficient way to test any JavaScript application."
      src="https://raw.githubusercontent.com/testing-library/dom-testing-library/master/other/testingjavascript.jpg"
    />
  </a>
</div>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The Problem](#the-problem)
- [This Solution](#this-solution)
- [Installation](#installation)
- [Documentation](#documentation)
- [Guiding Principles](#guiding-principles)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The Problem

You want to write maintainable tests for your Web UI. As a part of this goal,
you want your tests to avoid including implementation details of your components
and rather focus on making your tests give you the confidence for which they are
intended. As part of this, you want your testbase to be maintainable in the long
run so refactors of your components (changes to implementation but not
functionality) don't break your tests and slow you and your team down.

## This Solution

The `DOM Testing Library` is a very light-weight solution for testing DOM nodes
(whether simulated with [`JSDOM`](https://github.com/jsdom/jsdom) as provided by
default with [Jest][] or in the browser). The main utilities it provides involve
querying the DOM for nodes in a way that's similar to how the user finds
elements on the page. In this way, the library helps ensure your tests give you
confidence in your UI code. The `DOM Testing Library`'s primary guiding
principle is:

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev @testing-library/dom
```

> [**Docs**](https://testing-library.com/docs/install)

## Documentation

Read the docs (and discover framework and tool-specific implementations) at
[testing-library.com](https://testing-library.com)

## Guiding Principles

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

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
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt="Kent C. Dodds"/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=kentcdodds" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.smooth-code.com"><img src="https://avatars2.githubusercontent.com/u/266302?v=4" width="100px;" alt="Greg Bergé"/><br /><sub><b>Greg Bergé</b></sub></a><br /><a href="#ideas-neoziro" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://audiolion.github.io"><img src="https://avatars1.githubusercontent.com/u/2430381?v=4" width="100px;" alt="Ryan Castner"/><br /><sub><b>Ryan Castner</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=audiolion" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.dnlsandiego.com"><img src="https://avatars0.githubusercontent.com/u/8008023?v=4" width="100px;" alt="Daniel Sandiego"/><br /><sub><b>Daniel Sandiego</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=dnlsandiego" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Miklet"><img src="https://avatars2.githubusercontent.com/u/12592677?v=4" width="100px;" alt="Paweł Mikołajczyk"/><br /><sub><b>Paweł Mikołajczyk</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=Miklet" title="Code">💻</a></td>
    <td align="center"><a href="http://co.linkedin.com/in/alejandronanez/"><img src="https://avatars3.githubusercontent.com/u/464978?v=4" width="100px;" alt="Alejandro Ñáñez Ortiz"/><br /><sub><b>Alejandro Ñáñez Ortiz</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=alejandronanez" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/pbomb"><img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;" alt="Matt Parrish"/><br /><sub><b>Matt Parrish</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/issues?q=author%3Apbomb" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=pbomb" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=pbomb" title="Documentation">📖</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=pbomb" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/wKovacs64"><img src="https://avatars1.githubusercontent.com/u/1288694?v=4" width="100px;" alt="Justin Hall"/><br /><sub><b>Justin Hall</b></sub></a><br /><a href="#platform-wKovacs64" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="https://github.com/antoaravinth"><img src="https://avatars1.githubusercontent.com/u/1241511?s=460&v=4" width="100px;" alt="Anto Aravinth"/><br /><sub><b>Anto Aravinth</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=antoaravinth" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=antoaravinth" title="Tests">⚠️</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=antoaravinth" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/JonahMoses"><img src="https://avatars2.githubusercontent.com/u/3462296?v=4" width="100px;" alt="Jonah Moses"/><br /><sub><b>Jonah Moses</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=JonahMoses" title="Documentation">📖</a></td>
    <td align="center"><a href="http://team.thebrain.pro"><img src="https://avatars1.githubusercontent.com/u/4002543?v=4" width="100px;" alt="Łukasz Gandecki"/><br /><sub><b>Łukasz Gandecki</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=lgandecki" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=lgandecki" title="Tests">⚠️</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=lgandecki" title="Documentation">📖</a></td>
    <td align="center"><a href="https://sompylasar.github.io"><img src="https://avatars2.githubusercontent.com/u/498274?v=4" width="100px;" alt="Ivan Babak"/><br /><sub><b>Ivan Babak</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/issues?q=author%3Asompylasar" title="Bug reports">🐛</a> <a href="#ideas-sompylasar" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=sompylasar" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=sompylasar" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/jday3"><img src="https://avatars3.githubusercontent.com/u/4439618?v=4" width="100px;" alt="Jesse Day"/><br /><sub><b>Jesse Day</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=jday3" title="Code">💻</a></td>
    <td align="center"><a href="http://gnapse.github.io"><img src="https://avatars0.githubusercontent.com/u/15199?v=4" width="100px;" alt="Ernesto García"/><br /><sub><b>Ernesto García</b></sub></a><br /><a href="#question-gnapse" title="Answering Questions">💬</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=gnapse" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=gnapse" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://jomaxx.com"><img src="https://avatars2.githubusercontent.com/u/2747424?v=4" width="100px;" alt="Josef Maxx Blake"/><br /><sub><b>Josef Maxx Blake</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=jomaxx" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=jomaxx" title="Documentation">📖</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=jomaxx" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/alecook"><img src="https://avatars3.githubusercontent.com/u/725236?v=4" width="100px;" alt="Alex Cook"/><br /><sub><b>Alex Cook</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=alecook" title="Documentation">📖</a> <a href="#example-alecook" title="Examples">💡</a> <a href="#review-alecook" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/dfcook"><img src="https://avatars3.githubusercontent.com/u/10348212?v=4" width="100px;" alt="Daniel Cook"/><br /><sub><b>Daniel Cook</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=dfcook" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=dfcook" title="Documentation">📖</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=dfcook" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/thchia"><img src="https://avatars2.githubusercontent.com/u/21194045?s=400&v=4" width="100px;" alt="Thomas Chia"/><br /><sub><b>Thomas Chia</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/issues?q=author%3Athchia" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=thchia" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tdeschryver"><img src="https://avatars1.githubusercontent.com/u/28659384?v=4" width="100px;" alt="Tim Deschryver"/><br /><sub><b>Tim Deschryver</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=tdeschryver" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=tdeschryver" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://alexkrolick.com"><img src="https://avatars3.githubusercontent.com/u/1571667?v=4" width="100px;" alt="Alex Krolick"/><br /><sub><b>Alex Krolick</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=alexkrolick" title="Code">💻</a></td>
    <td align="center"><a href="http://www.maddijoyce.com"><img src="https://avatars2.githubusercontent.com/u/2224291?v=4" width="100px;" alt="Maddi Joyce"/><br /><sub><b>Maddi Joyce</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=maddijoyce" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/npeterkamps"><img src="https://avatars1.githubusercontent.com/u/25429764?v=4" width="100px;" alt="Peter Kamps"/><br /><sub><b>Peter Kamps</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/issues?q=author%3Anpeterkamps" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=npeterkamps" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=npeterkamps" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://jonathanstoye.de"><img src="https://avatars2.githubusercontent.com/u/21689428?v=4" width="100px;" alt="Jonathan Stoye"/><br /><sub><b>Jonathan Stoye</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=JonathanStoye" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/yongdamsh"><img src="https://avatars2.githubusercontent.com/u/4126644?v=4" width="100px;" alt="Sanghyeon Lee"/><br /><sub><b>Sanghyeon Lee</b></sub></a><br /><a href="#example-yongdamsh" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/Dajust"><img src="https://avatars3.githubusercontent.com/u/8015514?v=4" width="100px;" alt="Justice Mba "/><br /><sub><b>Justice Mba </b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=Dajust" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=Dajust" title="Documentation">📖</a> <a href="#ideas-Dajust" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/wgcrouch"><img src="https://avatars3.githubusercontent.com/u/340761?v=4" width="100px;" alt="Wayne Crouch"/><br /><sub><b>Wayne Crouch</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=wgcrouch" title="Code">💻</a></td>
    <td align="center"><a href="http://benjaminelliott.co.uk"><img src="https://avatars1.githubusercontent.com/u/4996462?v=4" width="100px;" alt="Ben Elliott"/><br /><sub><b>Ben Elliott</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=benelliott" title="Code">💻</a></td>
    <td align="center"><a href="http://nuances.co"><img src="https://avatars3.githubusercontent.com/u/577921?v=4" width="100px;" alt="Ruben Costa"/><br /><sub><b>Ruben Costa</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=rubencosta" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://rbrtsmith.com/"><img src="https://avatars2.githubusercontent.com/u/4982001?v=4" width="100px;" alt="Robert Smith"/><br /><sub><b>Robert Smith</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/issues?q=author%3Arbrtsmith" title="Bug reports">🐛</a> <a href="#ideas-rbrtsmith" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=rbrtsmith" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/dadamssg"><img src="https://avatars3.githubusercontent.com/u/881986?v=4" width="100px;" alt="dadamssg"/><br /><sub><b>dadamssg</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=dadamssg" title="Code">💻</a></td>
    <td align="center"><a href="https://neilkistner.com/"><img src="https://avatars1.githubusercontent.com/u/186971?v=4" width="100px;" alt="Neil Kistner"/><br /><sub><b>Neil Kistner</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=wyze" title="Code">💻</a></td>
    <td align="center"><a href="http://bdchauvette.net/"><img src="https://avatars3.githubusercontent.com/u/1448597?v=4" width="100px;" alt="Ben Chauvette"/><br /><sub><b>Ben Chauvette</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=bdchauvette" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/JeffBaumgardt"><img src="https://avatars2.githubusercontent.com/u/777527?v=4" width="100px;" alt="Jeff Baumgardt"/><br /><sub><b>Jeff Baumgardt</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=JeffBaumgardt" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=JeffBaumgardt" title="Documentation">📖</a></td>
    <td align="center"><a href="http://matchai.me"><img src="https://avatars0.githubusercontent.com/u/4658208?v=4" width="100px;" alt="Matan Kushner"/><br /><sub><b>Matan Kushner</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=matchai" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=matchai" title="Documentation">📖</a> <a href="#ideas-matchai" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=matchai" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.wendtedesigns.com/"><img src="https://avatars2.githubusercontent.com/u/5779538?v=4" width="100px;" alt="Alex Wendte"/><br /><sub><b>Alex Wendte</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=themostcolm" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=themostcolm" title="Documentation">📖</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=themostcolm" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/ruffle1986"><img src="https://avatars0.githubusercontent.com/u/2196208?v=4" width="100px;" alt="Tamas Fodor"/><br /><sub><b>Tamas Fodor</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=ruffle1986" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/BenjaminEckardt"><img src="https://avatars3.githubusercontent.com/u/14793495?v=4" width="100px;" alt="Benjamin Eckardt"/><br /><sub><b>Benjamin Eckardt</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=BenjaminEckardt" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/campbellr"><img src="https://avatars3.githubusercontent.com/u/205752?v=4" width="100px;" alt="Ryan Campbell"/><br /><sub><b>Ryan Campbell</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=campbellr" title="Documentation">📖</a></td>
    <td align="center"><a href="https://taylor-briggs.com"><img src="https://avatars2.githubusercontent.com/u/1335519?v=4" width="100px;" alt="Taylor Briggs"/><br /><sub><b>Taylor Briggs</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=TaylorBriggs" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/jgoz"><img src="https://avatars2.githubusercontent.com/u/132233?v=4" width="100px;" alt="John Gozde"/><br /><sub><b>John Gozde</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=jgoz" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/chentsulin"><img src="https://avatars2.githubusercontent.com/u/3382565?v=4" width="100px;" alt="C. T. Lin"/><br /><sub><b>C. T. Lin</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=chentsulin" title="Documentation">📖</a></td>
    <td align="center"><a href="http://terrencewwong.com"><img src="https://avatars3.githubusercontent.com/u/5312329?v=4" width="100px;" alt="Terrence Wong"/><br /><sub><b>Terrence Wong</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=terrencewwong" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.ossfinder.com"><img src="https://avatars0.githubusercontent.com/u/12230408?v=4" width="100px;" alt="Soo Jae Hwang"/><br /><sub><b>Soo Jae Hwang</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=misoguy" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/RoystonS"><img src="https://avatars0.githubusercontent.com/u/19773?v=4" width="100px;" alt="Royston Shufflebotham"/><br /><sub><b>Royston Shufflebotham</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/issues?q=author%3ARoystonS" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=RoystonS" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=RoystonS" title="Documentation">📖</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=RoystonS" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.vadimbrodsky.com"><img src="https://avatars0.githubusercontent.com/u/591673?v=4" width="100px;" alt="Vadim Brodsky"/><br /><sub><b>Vadim Brodsky</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=VadimBrodsky" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/eunjae_lee"><img src="https://avatars3.githubusercontent.com/u/499898?v=4" width="100px;" alt="Eunjae Lee"/><br /><sub><b>Eunjae Lee</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=eunjae-lee" title="Code">💻</a></td>
    <td align="center"><a href="http://davidpeter.me"><img src="https://avatars2.githubusercontent.com/u/167743?v=4" width="100px;" alt="David Peter"/><br /><sub><b>David Peter</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=sarenji" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/@puemos"><img src="https://avatars0.githubusercontent.com/u/13174025?v=4" width="100px;" alt="Shy Alter"/><br /><sub><b>Shy Alter</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=puemos" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=puemos" title="Documentation">📖</a></td>
    <td align="center"><a href="https://lukaszmakuch.pl"><img src="https://avatars1.githubusercontent.com/u/11966621?v=4" width="100px;" alt="Łukasz Makuch"/><br /><sub><b>Łukasz Makuch</b></sub></a><br /><a href="#platform-lukaszmakuch" title="Packaging/porting to new platform">📦</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/tylerthehaas"><img src="https://avatars1.githubusercontent.com/u/11150235?v=4" width="100px;" alt="Tyler Haas"/><br /><sub><b>Tyler Haas</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=tylerthehaas" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=tylerthehaas" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://vesalaakso.com"><img src="https://avatars2.githubusercontent.com/u/482561?v=4" width="100px;" alt="Vesa Laakso"/><br /><sub><b>Vesa Laakso</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=valscion" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=valscion" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Tolsee"><img src="https://avatars0.githubusercontent.com/u/16590492?v=4" width="100px;" alt="Tulsi Sapkota"/><br /><sub><b>Tulsi Sapkota</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=Tolsee" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tnunes"><img src="https://avatars1.githubusercontent.com/u/163187?v=4" width="100px;" alt="Tiago Nunes"/><br /><sub><b>Tiago Nunes</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=tnunes" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=tnunes" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/JaxCavalera"><img src="https://avatars1.githubusercontent.com/u/15429762?v=4" width="100px;" alt="JaxCavalera"/><br /><sub><b>JaxCavalera</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=JaxCavalera" title="Code">💻</a> <a href="#review-JaxCavalera" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/bopfer"><img src="https://avatars2.githubusercontent.com/u/824368?v=4" width="100px;" alt="bopfer"/><br /><sub><b>bopfer</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=bopfer" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://blog.alfrescian.com"><img src="https://avatars0.githubusercontent.com/u/1340740?v=4" width="100px;" alt="Jan Pfitzner"/><br /><sub><b>Jan Pfitzner</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=alfrescian" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/dbismut"><img src="https://avatars2.githubusercontent.com/u/5003380?v=4" width="100px;" alt="David"/><br /><sub><b>David</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=dbismut" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/diego_codes"><img src="https://avatars0.githubusercontent.com/u/5973294?v=4" width="100px;" alt="Diego Hernandez"/><br /><sub><b>Diego Hernandez</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=diego-codes" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=diego-codes" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/foray1010"><img src="https://avatars3.githubusercontent.com/u/3212221?v=4" width="100px;" alt="Alex Young"/><br /><sub><b>Alex Young</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=foray1010" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/paularmstrong"><img src="https://avatars1.githubusercontent.com/u/33297?v=4" width="100px;" alt="Paul Armstrong"/><br /><sub><b>Paul Armstrong</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=paularmstrong" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=paularmstrong" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://hu.linkedin.com/pub/tamas-szabo/57/a4b/242"><img src="https://avatars0.githubusercontent.com/u/3720079?v=4" width="100px;" alt="Tamás Szabó"/><br /><sub><b>Tamás Szabó</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=szabototo89" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=szabototo89" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://twitter.com/dylan_piercey"><img src="https://avatars2.githubusercontent.com/u/4985201?v=4" width="100px;" alt="Dylan Piercey"/><br /><sub><b>Dylan Piercey</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=DylanPiercey" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=DylanPiercey" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/michaellasky"><img src="https://avatars2.githubusercontent.com/u/6646599?v=4" width="100px;" alt="Michael Lasky"/><br /><sub><b>Michael Lasky</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=michaellasky" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=michaellasky" title="Tests">⚠️</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=michaellasky" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://twitter.com/sebsilbermann"><img src="https://avatars3.githubusercontent.com/u/12292047?v=4" width="100px;" alt="Sebastian Silbermann"/><br /><sub><b>Sebastian Silbermann</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=eps1lon" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=eps1lon" title="Tests">⚠️</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=eps1lon" title="Documentation">📖</a> <a href="#infra-eps1lon" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://dylanvann.com/"><img src="https://avatars0.githubusercontent.com/u/1537615?v=4" width="100px;" alt="Dylan Vann"/><br /><sub><b>Dylan Vann</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=DylanVann" title="Code">💻</a></td>
    <td align="center"><a href="https://afontcu.dev"><img src="https://avatars0.githubusercontent.com/u/9197791?v=4" width="100px;" alt="Adrià Fontcuberta"/><br /><sub><b>Adrià Fontcuberta</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=afontcu" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=afontcu" title="Tests">⚠️</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=afontcu" title="Documentation">📖</a></td>
    <td align="center"><a href="http://thomlom.dev"><img src="https://avatars3.githubusercontent.com/u/16003285?v=4" width="100px;" alt="Thomas Lombart"/><br /><sub><b>Thomas Lombart</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=thomlom" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/SavePointSam"><img src="https://avatars0.githubusercontent.com/u/8203211?v=4" width="100px;" alt="Sam Horton"/><br /><sub><b>Sam Horton</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=SavePointSam" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=SavePointSam" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://andrewhillcode.com"><img src="https://avatars1.githubusercontent.com/u/12396191?v=4" width="100px;" alt="Andrew Hill"/><br /><sub><b>Andrew Hill</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=andrewhillcode" title="Code">💻</a></td>
    <td align="center"><a href="https://amann.me"><img src="https://avatars1.githubusercontent.com/u/4038316?v=4" width="100px;" alt="Jan Amann"/><br /><sub><b>Jan Amann</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=amannn" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=amannn" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/brapifra"><img src="https://avatars3.githubusercontent.com/u/17855450?v=4" width="100px;" alt="Brais Piñeiro"/><br /><sub><b>Brais Piñeiro</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=brapifra" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=brapifra" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.dominykas.com/"><img src="https://avatars1.githubusercontent.com/u/505619?v=4" width="100px;" alt="Dominykas Blyžė"/><br /><sub><b>Dominykas Blyžė</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=dominykas" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=dominykas" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://olzhas.de"><img src="https://avatars3.githubusercontent.com/u/15848876?v=4" width="100px;" alt="Olzhas Askar"/><br /><sub><b>Olzhas Askar</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=pheeria" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=pheeria" title="Tests">⚠️</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=pheeria" title="Documentation">📖</a></td>
    <td align="center"><a href="https://twitter.com/mbelsky_"><img src="https://avatars1.githubusercontent.com/u/3923527?v=4" width="100px;" alt="Max Belsky"/><br /><sub><b>Max Belsky</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=mbelsky" title="Code">💻</a> <a href="https://github.com/testing-library/dom-testing-library/commits?author=mbelsky" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/mmantel"><img src="https://avatars2.githubusercontent.com/u/1326403?v=4" width="100px;" alt="Michael Mantel"/><br /><sub><b>Michael Mantel</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=mmantel" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://tomdoes.tech/"><img src="https://avatars1.githubusercontent.com/u/8683577?v=4" width="100px;" alt="Tom Nagle"/><br /><sub><b>Tom Nagle</b></sub></a><br /><a href="https://github.com/testing-library/dom-testing-library/commits?author=tomanagle" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

[MIT](LICENSE)

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]:
  https://img.shields.io/travis/testing-library/dom-testing-library.svg?style=flat-square
[build]: https://travis-ci.org/testing-library/dom-testing-library
[coverage-badge]:
  https://img.shields.io/codecov/c/github/testing-library/dom-testing-library.svg?style=flat-square
[coverage]: https://codecov.io/github/testing-library/dom-testing-library
[version-badge]:
  https://img.shields.io/npm/v/dom-testing-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/@testing-library/dom
[downloads-badge]:
  https://img.shields.io/npm/dm/@testing-library/dom.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/@testing-library/dom
[license-badge]:
  https://img.shields.io/npm/l/@testing-library/dom.svg?style=flat-square
[license]:
  https://github.com/testing-library/dom-testing-library/blob/master/LICENSE
[prs-badge]:
  https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]:
  https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]:
  https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]:
  https://github.com/testing-library/dom-testing-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]:
  https://img.shields.io/github/watchers/testing-library/dom-testing-library.svg?style=social
[github-watch]: https://github.com/testing-library/dom-testing-library/watchers
[github-star-badge]:
  https://img.shields.io/github/stars/testing-library/dom-testing-library.svg?style=social
[github-star]: https://github.com/testing-library/dom-testing-library/stargazers
[twitter]:
  https://twitter.com/intent/tweet?text=Check%20out%20dom-testing-library%20by%20%40testing-library%20https%3A%2F%2Fgithub.com%2Ftesting-library%2Fdom-testing-library%20%F0%9F%91%8D
[twitter-badge]:
  https://img.shields.io/twitter/url/https/github.com/testing-library/dom-testing-library.svg?style=social
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[set-immediate]:
  https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate
[guiding-principle]: https://twitter.com/kentcdodds/status/977018512689455106
[jest]: https://facebook.github.io/jest
