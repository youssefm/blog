---
title: "Animating a progress bar with CSS scroll-driven animations"
description: "Scroll-driven animations are an exciting new addition to CSS. In this post, we build a scroll-linked progress bar that fills up as you scroll down the page."
publishedOn: 2023-12-31
---

If you're visiting this page using Chrome or another Chromium-based browser, you'll notice an amber progress bar at the top of the page that grows as you read this post. This used to only be possible with Javascript but with the advent of [CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations), we can easily achieve this effect with just CSS.

**tldr:** here's the HTML and CSS. Keep reading for an explanation of how this all works.

```html {2}
<body>
  <div class="progress-bar"></div>
  ...
</body>
```

```css
@supports (animation-timeline: scroll()) {
  @keyframes scaleProgress {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 12px;
    animation: scaleProgress linear;
    animation-timeline: scroll();
    transform-origin: left;
    background-color: #b45309;
  }
}
```

## Explanation

Let's start by positioning our progress bar:

```css {2-6}
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;
  ...
}
```

We're fixing the progress bar at the top of our viewport and giving it a height of 12 pixels. Next, let's look at the animation:

```css {1-8,12-14}
@keyframes scaleProgress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.progress-bar {
  ...
  animation: scaleProgress linear;
  animation-timeline: scroll();
  transform-origin: left;
  ...
}
```

Our animation starts off with an empty bar (`scaleX(0)`) and animates to a full progress bar (`scaleX(1)`). We're telling the browser this animation should progress based on scroll position rather than time using `animation-timeline: scroll()`. We're also telling the browser this animation should progress *linearly*. That is, we want the progress bar to be X% full whenever the scroll position is at X% of the page content. Finally, we want this animation to start from the left so we use `transform-origin: left`. Without this, the progress bar would expand from the center of the screen.

The last line of CSS is the `background-color`, which we can set to whatever color we want for our progress bar.

## Caveats

At the moment, CSS scroll-driven animations are only supported by Chrome and other Chromium-based browsers. However, Firefox is working on an implementation and we can only hope other browsers, *cough... Safari*, will follow suit. You can check [this Caniuse table](https://caniuse.com/mdn-css_properties_scroll-timeline) for the current state of browser support.

This is why we have to be careful about wrapping our CSS with `@supports (animation-timeline: scroll())`. We're telling browsers to ignore the CSS if scroll-driven animations are not supported. Without this at-rule, visitors would always see a full progress bar in browsers lacking support.

## Conclusion

Scroll-driven animations are an exciting new addition to CSS. In this post, we demonstrated how we can easily build a scroll-linked progress bar, but there are many more ways to use these animations. Here are a couple resources worth checking out if you're looking to learn more:

* [A Chrome article with an overview of scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
* [A bunch of demos to show off scroll-driven animations](https://scroll-driven-animations.style/)
* [MDN documentation for animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)
