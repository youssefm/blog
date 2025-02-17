---
title: "When to upgrade open-source packages: a cost-benefit analysis"
description: "By applying cost-benefit analysis from economics, I delve into how developers can make informed choices about upgrading dependencies in production systems."
publishedOn: 2025-02-16
---

At the end of my sophomore year at Caltech, I made the decision to forgo a career in physics and chose instead to focus my studies on computer science and economics. That was the start of my love story with the field of economics. Many people mistakenly believe that economics is limited to the study of money, but it's really the study of decision-making under scarcity. That means you can apply economic thinking to many facets of life, including software development.

This will be the start of a series where I attempt to do just that—applying cost-benefit analysis to software engineering practices. How many tests should you be writing? How should you decide which libraries to depend on? What kind of technical debt should you take on? In this first post, we'll discuss the costs and benefits of upgrading open-source packages for production systems, and how to decide when to do so.

## The benefits

Let's start with the benefits in our equation. The benefits for any particular package upgrade will depend on the specific library you're upgrading and the version you're upgrading to, but you can usually expect to find:

- New features
- Bug fixes
- Security fixes
- Performance improvements

While these are all good things, how much your application benefits from these is highly specific to your application. You might not need any of the features an upgrade provides and might not be affected by any of the bugs that an upgrade fixes. Or on the other hand, you might really need a particular feature to build something new or a particular bug fix to address an issue.

There's another class of benefits that are more subtle. By upgrading versions, you're making _future_ upgrades easier. Your application might not benefit much from upgrading right now, but someday, you might need to upgrade to a future version that hasn't been released yet. And when that day comes, you'll be glad you've already done part of the work to get you there. Finally, you're also keeping that library within the support window for bug fixes and security fixes. This benefit is even larger if you're upgrading to an LTS version (long-term support) of the package where you can often expect this support for years.

## The costs

The most obvious cost to upgrading a package is the time it takes to actually upgrade the package, address any breaking changes, run your test suite, make sure your application still works the way you expect it to. However, this may not be the most significant cost involved.

Every time you upgrade your package, you are **implicitly opting into the risk of a regression**. Mistakes happen all the time in software development, and a minor version upgrade that in theory shouldn't contain any breaking changes might accidentally break code that used to work just fine. Or significantly slow down something that used to be fast.

Again, this is highly dependent on the specific piece of code you're upgrading and the specific version. As a rule of thumb, major version upgrades are going to be riskier than minor ones, which are riskier than patch upgrades. Upgrading code that is widely used will generally be less risky than code that is less widely used. For example, the latest version of Python or TypeScript will be quite safe to upgrade to because of the amount of attention that code gets, while upgrading to the latest version of some library with 20 GitHub stars and a single maintainer might be much riskier. Last but not least, the longer a version has been out, the less risk you run upgrading to it. Every day that passes increases the chance that bugs have been addressed and that a release has been made more stable. A package version that has been out for a year is likely to be much more stable than one that has been out for a week.

## The tradeoff

So now that we understand the costs and benefits, how should we decide when to upgrade our packages? Like all good software engineering questions, this will vary from case to case and requires good judgment. But there are some generalities we can derive. In general, each version you upgrade will provide some benefits while the most substantial cost, the risk of regressions, is often non-linear. It is much riskier being on the "cutting edge" of releases than being a bit behind. So you're often faced with decisions that roughly look like this:

![Cost-benefit of upgrading packages](assets/upgrading-cost-benefit.svg)

If you are always upgrading to the latest version of every package, you are very likely in a position where the expected value of a regression is substantially higher than the benefit you're actually getting. On the flip side, if you never upgrade, you run the risk of missing out on important security fixes and your codebase gradually becoming obsolete.

So the right decision is often somewhere in the middle. A wide range of opinions are defensible here, but my own personal recommendation is to only upgrade packages when you have a good reason to. Here's what qualifies in my book:

- you need a critical security fix
- you're about to go outside the maintenance window
- you need a bug fix that you can't work around easily
- you need a new feature
- you would receive major performance improvements

By focusing on updates that offer real value, you can ensure your project benefits from package upgrades while minimizing the associated risks. Next time you're considering a package upgrade, weigh these costs and benefits carefully—your future self might thank you.
