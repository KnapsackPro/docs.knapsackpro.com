---
layout: post
title:  "Faster pipelines with Knapsack Pro by parallelizing Cypress tests on GitLab CI"
date:   2021-03-02 16:20:00 +0100
author: "Daniel Spitzer"
categories: continuous_integration
og_image: "/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/logo.png"
---

When the runtime of our build pipeline had reached 20 minutes on average for each commit on each Merge Request, we knew we needed a solution to speed things up. We wanted to optimize everything we could within the pipeline, a way of doing this was to parallelize our tests with [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci) to speed up our Cypress integration tests which would save us a sizable amount of time.

<a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/logo.png" >
  <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/logo.png" class="img-large" alt="Knapsack Pro, Gitlab, and Cypress logos flying around in a speed frenzy" />
</a>

<style>
.post a > figure > figcaption {
  color: #111;
  text-decoration: none;
}
.post a:hover > figure > figcaption,
.post a > figure:hover > figcaption,
.post a > figure > figcaption:hover {
  color: #1d7690;
  text-decoration: none;
}

.post p,
.post p > a > figure.
.post p > a > figure > img {
  display: block;
  width: 75%;
  margin: 15px auto;
}

.post section,
.post article {
  box-sizing: border-box;
}
.post section {
  display: flex;
  flex-wrap: wrap;
}
.post article {
  width: 50%;
  text-align: center;
  padding: 15px;
}

.post section > article > a > figure > img {
  max-height: 400px;
  display: block;
  margin: 0 auto 15px;
}
</style>

## What is our setup?

Our team is working on [Kiwi.com](https://www.kiwi.com/), which is a travel company selling tickets for flights, trains, buses and any other kinds of transportation. More specifically, the team is responsible for the Help Center, where users can go to find articles and chat with support before, during and after their trips.

Our application is deployed in two distinct ways: as an npm package integrated into other modules within Kiwi.com as a sidebar _(called **sidebar**)_, and as a standalone web application _(called **full-page**)_ which is dockerized and then deployed on GKE ([Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine)) for our production environment and using GCR ([Google Cloud Run](https://cloud.google.com/run)) for staging envs .

Most of the code is shared between these units but there are some minor differences in design and major differences in flows/functionality, so they need to be tested separately.

We use [GitLab](https://about.gitlab.com/) for code reviews and version control and GitLab CI to run our build pipelines.

We use [Cypress](https://www.cypress.io/) for end-to-end and integration testing with separate tests for both types of deployment.


## What problem are we trying to solve?

We want our pipelines and tests to run faster but not spend too much time nor money on doing it, so running each test on its own server is probably not the best way to go, not to mention the overhead of starting up the runners and checking out the source code.

If our pipelines are slow, developers could forget that they had something running in the background and jump between tasks or worse, somebody else merges code into the main branch and the pipeline has to be run again...

If our pipelines are fast, then we have to wait less while they are running, after applying some of the changes suggested during code reviews and to get hotfixes out to production if necessary.


## Manual splitting of Cypress tests

After seeing that running tests in series takes extremely long, we tried to split some areas up and run them on separate Cypress runners and this worked for a while. But, as the tests’ size grew asymmetrically, we had to shift around which suites should run together continuously.

<section>
  <article>
    <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/00-cypress-files-before-knapsack.png">
      <figure>
        <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/00-cypress-files-before-knapsack.png" class="img-large" alt="List of Cypress test files, showing that tests are nested two levels: by module and by feature or area" />
        <figcaption>List of Cypress test files, showing that tests are nested two levels: by module and by feature or area</figcaption>
      </figure>
    </a>
  </article>
  <article>
    <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/01-pipeline-jobs-before-knapsack.png">
      <figure>
        <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/01-pipeline-jobs-before-knapsack.png" class="img-list" alt="List of Cypress test Gitlab CI jobs, showing that there are many separate jobs for each of the test subfolders" />
        <figcaption>List of Cypress test Gitlab CI jobs, showing that there are many separate jobs for each of the test subfolders</figcaption>
      </figure>
    </a>
  </article>
  <article>
    <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/02-cypress-runtime-before-knapsack.png">
      <figure>
        <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/02-cypress-runtime-before-knapsack.png" class="img-list" alt="List of Cypress test Gitlab CI jobs, showing that job runtimes vary from 53 seconds to 5 minutes" />
        <figcaption>List of Cypress test Gitlab CI jobs, showing that job runtimes vary from 53 seconds to 5 minutes</figcaption>
      </figure>
    </a>
  </article>
  <article>
    <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/03-pipeline-runtime-before-knapsack.png">
      <figure>
        <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/03-pipeline-runtime-before-knapsack.png" class="img-list" alt="Pipeline summary showing: 33 jobs for master in 19 minutes and 24 seconds" />
        <figcaption>Pipeline summary</figcaption>
      </figure>
    </a>
  </article>
</section>

## What is Knapsack Pro?

[Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci) is a tool that helps split up test suites in a dynamic way across parallel CI runners to ensure that each runner finishes work simultaneously.

Its name comes from the “[knapsack problem](https://en.wikipedia.org/wiki/Knapsack_problem)”, a problem in combinatorial optimization, to figure out how to take things (test suites) with certain attributes (number of tests, time it took on average to run, etc) and determine how best to divide them to get the most value (all CI nodes are running tests from boot until shutdown and they all finish at the same time).

It comes with a dashboard to see the distribution of test subsets for each parallel run of CI runners, which is useful when splitting test suites or to see if something is going wrong with the runs. The dashboard also suggests if you’d benefit from less or more parallel runners as well.

The founder of Knapsack Pro, [Artur Trzop](https://github.com/ArturT) has been helping us proactively, sometimes noticing and notifying us that something went wrong with our pipeline even before we did. Whenever we had an issue, we could just write to him and we would figure out a solution together.


## Plugging in Knapsack Pro

To try out [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci), all we did was [follow the docs](https://docs.knapsackpro.com/cypress/guide/) and afterward merge all separate Cypress jobs into one and set up some [reporterOptions](https://docs.cypress.io/guides/tooling/reporters.html#Reporter-Options) in Cypress to ensure that we’ll collect all of the test results as JUnit reports from all the parallel runs.

Here’s a short example of our **full-page** test jobs before the conversion:

{% highlight yml %}
{% raw %}
.cypress_fp: &cypress_fp
  stage: cypress
  image: "cypress/browsers:node14.15.0-chrome86-ff82"
  retry: 2
  before_script:
    - yarn install--frozen-lockfile --production=false
  artifacts: # save screenshots as an artifact
    name: fp-screenshots
    expire_in: 3 days
    when: on_failure
    paths:
      - cypress/screenshots/

fp contact:
  <<: *cypress_fp
  script:
    - yarn cypress:run-ci -s "./cypress/tests/full-page/contact/*.js"

fp login:
  <<: *cypress_fp
  script:
    - yarn cypress:run-ci-s "./cypress/tests/full-page/login/*.js"

fp search:
  <<: *cypress_fp
  script:
    - yarn cypress:run-ci -s "./cypress/tests/full-page/search/*.js"

# etc ...
{% endraw %}
{% endhighlight %}

Here is the new **full-page** test job after the conversion:

{% highlight yml %}
{% raw %}
.cypress_parallel_defaults: &cypress_parallel_defaults

full-page:
  stage: cypress
  image: "cypress/browsers:node14.15.0-chrome86-ff82"
  retry: 0
  parallel: 4
  before_script:
    - yarn install--frozen-lockfile --production=false
  script:
    - $(yarn bin)/knapsack-pro-cypress --record false --reporter junit --reporter-options "mochaFile=cypress/results/junit-[hash].xml"
  after_script: # collect all artifacts
    - mkdir -p cypress/screenshots/full-page && cp -r cypress/screenshots/full-page $CI_PROJECT_DIR
    - mkdir -p cypress/videos/full-page && cp -r cypress/videos/full-page $CI_PROJECT_DIR
    - mkdir -p cypress/results && cp -r cypress/results $CI_PROJECT_DIR
    # all the copying above is done to make it easy to browse the artifacts in the UI (single folder)
  artifacts: # save videos and screenshots as artifacts
    name: "$CI_JOB_NAME_$CI_NODE_INDEX-of-$CI_NODE_TOTAL"
    when: on_failure
    expire_in: 3 days
    paths:
      - full-page/
    reports:
      junit: results/junit-*.xml
    expose_as: cypress_full-page
  variables:
    CYPRESS_BASE_URL: https://$CI_ENVIRONMENT_SLUG.$CLOUDRUN_CUSTOM_DOMAIN_SUFFIX/en/help
    KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS: $KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS_FULL_PAGE
    KNAPSACK_PRO_CI_NODE_BUILD_ID: full-page-$CI_COMMIT_REF_SLUG-$CI_PIPELINE_ID
    KNAPSACK_PRO_TEST_FILE_PATTERN: cypress/full-page/*.js
{% endraw %}
{% endhighlight %}

This was the result we saw on the Knapsack Pro Dashboard, showing that our current separation of suites needs to be worked on to gain all the benefits of parallelization:

<p>
  <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/04-cypress-suites-fullpage-before-split.png">
    <figure>
      <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/04-cypress-suites-fullpage-before-split.png" class="img-large" alt="Knapsack Pro dashboard showing the slowest test files, slowest being almost four minutes while the second slowest is only 30 seconds" />
      <figcaption>Knapsack Pro dashboard showing the slowest test files, slowest being almost four minutes while the second slowest is only 30 seconds</figcaption>
    </figure>
  </a>
</p>

After some tweaking, splitting, and moving suites around, this is what we finally had:

<section>
  <article>
    <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/05-cypress-files-after-knapsack.png">
      <figure>
        <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/05-cypress-files-after-knapsack.png" alt="List of Cypress test files, showing that tests are a single level: by module" />
        <figcaption>List of Cypress test files, showing that tests are a single level: by module</figcaption>
      </figure>
    </a>
      </article>
      <article>
    <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/06-pipeline-jobs-after-knapsack.png">
      <figure>
        <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/06-pipeline-jobs-after-knapsack.png" alt="List of Cypress test Gitlab CI jobs, showing that there are only two separate jobs parallelized four times for each of the modules" />
        <figcaption>List of Cypress test Gitlab CI jobs, showing that there are only two separate jobs parallelized four times for each of the modules</figcaption>
      </figure>
    </a>
      </article>
      <article>
    <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/07-cypress-runtime-after-knapsack.png">
      <figure>
        <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/07-cypress-runtime-after-knapsack.png" alt="List of Cypress test Gitlab CI jobs, showing that job runtimes are almost equal for each batch of parallel jobs (3:18 - 3:24 and 2:07 - 2:17)" />
        <figcaption>List of Cypress test Gitlab CI jobs, showing that job runtimes are almost equal for each batch of parallel jobs (3:18 - 3:24 and 2:07 - 2:17)</figcaption>
      </figure>
    </a>
      </article>
      <article>
    <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/08-pipeline-runtime-after-knapsack.png">
      <figure>
        <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/08-pipeline-runtime-after-knapsack.png" alt="Pipeline summary showing: 33 jobs for master in 15 minutes and 21 seconds" />
        <figcaption>Pipeline summary</figcaption>
      </figure>
    </a>
  </article>
</section>

It is still not perfectly balanced but with this granularity, we can utilize four runners at the same time and there isn’t too much idle time, so we’re not wasting CPU cycles.

<p>
  <a target="_blank" rel="noopener" href="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/09-after_cypress_new_master_fullpage.png">
    <figure>
      <img src="/images/blog/posts/faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci/09-after_cypress_new_master_fullpage.png" alt="Knapsack Pro dashboard showing the slowest test files, slowest being 21.803 seconds while the second slowest being 21.001 seconds (some other tests are only 1-6 seconds short)" />
      <figcaption>Knapsack Pro dashboard showing the slowest test files, slowest being 21.803 seconds while the second slowest being 21.001 seconds (some other tests are only 1-6 seconds short)</figcaption>
    </figure>
  </a>
</p>


## What else can we do?

15 minutes still feels long, pipeline runtimes around 10 minutes are a good goal to reach but we have more optimization to do around build times and Docker compilation times, which are out of scope for this article. If you’re interested in reading more about how to do that, I can recommend the article [Docker for JavaScript Devs: How to Containerize Node.js Apps Efficiently](https://www.robincussol.com/docker-for-js-devs-how-to-containerise-nodejs-apps-efficiently/) for more details.


## Results

The switch to [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=faster-pipelines-with-knapsack-pro-by-parallelizing-cypress-tests-on-gitlab-ci) took less than a day. Most of the work afterward was to split up tasks and optimize other parts of GitLab CI. The whole process took two weeks for a single developer.

By splitting up the test suites into smaller, equal sized chunks, running tests parallelized on four CI runners (for each of our target builds) and some other general pipeline fixes (better caching between jobs/steps, only running parts of the pipeline for actual changes), we’ve managed to decrease our pipeline runtime of ~20 minutes to ~15 minutes.

When we add more test suites, Knapsack Pro will take care of sorting the tests to the proper CI runners to ensure that pipeline runtimes don’t increase if necessary.

We sped up our pipeline by 25%, or 5 minutes on average, and seeing that each of our three developers starts about 6-10 pipelines a day (depending on the workload and type of work), we’ve essentially saved between 90-150 minutes of development time a day, as well as increased morale because **_nobody likes to wait._**
