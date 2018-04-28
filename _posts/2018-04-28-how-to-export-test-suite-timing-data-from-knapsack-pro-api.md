---
layout: post
title:  "How to export test suite timing data from Knapsack Pro API"
date:   2018-04-28 17:00:00 +0200
author: "Artur Trzop"
categories: API "test suite" "export data"
---

[Knapsack Pro](https://knapsackpro.com) tracks your CI builds and how long each test files took to run on one of parallel CI nodes. Thanks to that Knapsack Pro can prepare the optimal test suite split for your future test suite runs on your CI provider.

You may find useful to export data about your CI builds and timing for your test files in case you would like to analyze it and observe trends how your test files change over time.

## How to get a list of all CI builds

You can get the list of all CI builds recorded by Knapsack Pro tool. You need `test suite API token`. You can get it from [user dashboard](https://knapsackpro.com/dashboard).

{% highlight plain %}
curl -X GET \
  https://api.knapsackpro.com/v1/builds \
  -H 'cache-control: no-cache' \
  -H 'KNAPSACK-PRO-TEST-SUITE-TOKEN: e5311882cbba506223ee8036fa68dc13'
{% endhighlight %}

You will get a response from API with the list of CI builds.

{% highlight plain %}
[
  {
    "id": "651efcce-cc5f-4cfc-b8fa-f49b4e5fb4af",
    "commit_hash": "347f33f598e5c66727e36b6f0c13b034f6a057f0",
    "branch": "master",
    "node_total": 3,
    "created_at": "2018-04-21T10:57:42.439Z",
    "updated_at": "2018-04-21T10:57:54.989Z"
  },
  {
    "id": "ba2190af-1bb1-4e3a-8ce1-37303549a4c3",
    "commit_hash": "347f33f598e5c66727e36b6f0c13b034f6a057f0",
    "branch": "master",
    "node_total": 2,
    "created_at": "2018-04-02T10:00:44.741Z",
    "updated_at": "2018-04-02T10:00:44.763Z"
  }
]
{% endhighlight %}

Note the CI build from Knapsack Pro API perspective means a unique combination of `commit_hash`, `branch`, `node_total`. Even when you run multiple CI builds in your CI provider for the same combination of fields there will be only single CI build on Knapsack Pro API side.

You can use `id` of the build to fetch detailed info about tests recorded for that CI build by doing request to `https://api.knapsackpro.com/v1/builds/:id` endpoint. You will learn about it in next section.

You can see [summary of `GET https://api.knapsackpro.com/v1/builds` endpoint here](/api/v1/#builds_get).

## How to get the timing of test files for CI build

You can get detailed info about CI build with all `build subsets` containing the test files recorded timing for that CI build.

{% highlight plain %}
curl -X GET \
  https://api.knapsackpro.com/v1/builds/651efcce-cc5f-4cfc-b8fa-f49b4e5fb4af \
  -H 'cache-control: no-cache' \
  -H 'KNAPSACK-PRO-TEST-SUITE-TOKEN: e5311882cbba506223ee8036fa68dc13'
{% endhighlight %}

Note the CI build means unique combination of __commit_hash__, __branch__, __node_total__.
If you will run your tests multiple times for that combination then you will get multiple recorded `build subset` records with test files timing for particular CI node indexes.

For instance, you can get a response from Knapsack Pro API:

{% highlight plain %}
{
  "id": "651efcce-cc5f-4cfc-b8fa-f49b4e5fb4af",
  "commit_hash": "347f33f598e5c66727e36b6f0c13b034f6a057f0",
  "branch": "master",
  "node_total": 2,
  "created_at": "2018-04-02T10:00:44.741Z",
  "updated_at": "2018-04-02T10:00:44.763Z",
  "build_subsets": [
    {
      "id": "b9f09921-939d-43a6-ae5d-7c95866b4dec",
      "node_index": 0,
      "created_at": "2018-04-21T11:18:34.539Z",
      "updated_at": "2018-04-21T11:18:34.539Z",
      "test_files": [
        {
          "path": "spec/a_spec.rb",
          "time_execution": 0.0008809566497802734
        },
        {
          "path": "spec/b_spec.rb",
          "time_execution": 0.019934892654418945
        }
      ]
    },
    {
      "id": "2fa57fa8-0ff3-4af8-980f-5788c5ab6d21",
      "node_index": 0,
      "created_at": "2018-04-21T11:18:23.750Z",
      "updated_at": "2018-04-21T11:18:23.750Z",
      "test_files": [
        {
          "path": "spec/a_spec.rb",
          "time_execution": 0.011754035949707031
        },
        {
          "path": "spec/b_spec.rb",
          "time_execution": 0.22170114517211914
        }
      ]
    },
    {
      "id": "f7a0bdda-54d6-48b2-965a-4b1a4153043d",
      "node_index": 1,
      "created_at": "2018-04-21T11:18:39.506Z",
      "updated_at": "2018-04-21T11:18:39.506Z",
      "test_files": [
        {
          "path": "spec/c_spec.rb",
          "time_execution": 0.013020992279052734
        },
        {
          "path": "spec/d_spec.rb",
          "time_execution": 0.0174105167388916
        },
        {
          "path": "spec/e_spec.rb",
          "time_execution": 0.23191308975219727
        }
      ]
    },
    {
      "id": "cd424b01-9dfc-4b6d-be5f-e8acbea6c6f3",
      "node_index": 1,
      "created_at": "2018-04-21T11:18:29.156Z",
      "updated_at": "2018-04-21T11:18:29.156Z",
      "test_files": [
        {
          "path": "spec/c_spec.rb",
          "time_execution": 0.011027812957763672
        },
        {
          "path": "spec/d_spec.rb",
          "time_execution": 0.019047812957763879
        },
        {
          "path": "spec/e_spec.rb",
          "time_execution": 0.038027712957363670
        }
      ]
    }
  ]
}
{% endhighlight %}

As you can see in the response you have two records for `node_index=0` and two for `node_index=1` because test suite was executed twice on CI provider.

You can see [summary of `GET https://api.knapsackpro.com/v1/builds/:id` endpoint here](/api/v1/#builds__id_get).

Hope this helps you to do whatever you like to do with your data. We keep data for last 90 days. If you need the data for a longer period please store them on your side. :)
