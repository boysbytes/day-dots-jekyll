---
layout: default
permalink: /days/:slug/
---

{% assign day = site.data.days | where: "slug", page.slug | first %}

<article>
  <h1>{{ day.title }}</h1>
  <time datetime="{{ day.date }}">{{ day.date | date: "%B %-d, %Y" }}</time>
  <div class="content">
    {{ day.content | markdownify }}
  </div>
</article>
