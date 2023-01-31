"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[813],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(n),f=o,k=d["".concat(s,".").concat(f)]||d[f]||p[f]||r;return n?a.createElement(k,i(i({ref:t},c),{},{components:n})):a.createElement(k,i({ref:t},c))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var u=2;u<r;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1280:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>p,frontMatter:()=>r,metadata:()=>l,toc:()=>u});var a=n(7462),o=(n(7294),n(3905));const r={pagination_next:null,pagination_prev:null},i="Cookbook",l={unversionedId:"ruby/cookbook",id:"ruby/cookbook",title:"Cookbook",description:"Run Knapsack Pro on a subset of parallel CI nodes (instead of all)",source:"@site/docs/ruby/cookbook.md",sourceDirName:"ruby",slug:"/ruby/cookbook",permalink:"/ruby/cookbook",draft:!1,editUrl:"https://github.com/KnapsackPro/docs.knapsackpro.com/tree/main/docusaurus/docs/ruby/cookbook.md",tags:[],version:"current",frontMatter:{pagination_next:null,pagination_prev:null},sidebar:"sidebar"},s={},u=[{value:"Run Knapsack Pro on a subset of parallel CI nodes (instead of all)",id:"run-knapsack-pro-on-a-subset-of-parallel-ci-nodes-instead-of-all",level:2},{value:"Fail the CI build if one of the test files exceeds a certain time limit",id:"fail-the-ci-build-if-one-of-the-test-files-exceeds-a-certain-time-limit",level:2},{value:"Run multiple test commands with one script",id:"run-multiple-test-commands-with-one-script",level:2},{value:"Run (and fail fast) multiple test commands with one script",id:"run-and-fail-fast-multiple-test-commands-with-one-script",level:2},{value:"Related FAQs",id:"related-faqs",level:2}],c={toc:u};function p(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"cookbook"},"Cookbook"),(0,o.kt)("h2",{id:"run-knapsack-pro-on-a-subset-of-parallel-ci-nodes-instead-of-all"},"Run Knapsack Pro on a subset of parallel CI nodes (instead of all)"),(0,o.kt)("p",null,"You may want to run Knapsack Pro only on a subset of parallel CI nodes, and use the others nodes for something else (e.g., linters)."),(0,o.kt)("p",null,"For example, you could decide to run Knapsack Pro on all the CI nodes but the last one:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ruby"},"KNAPSACK_PRO_CI_NODE_TOTAL=$((MY_CI_NODE_TOTAL-1)) bundle exec rake knapsack_pro:queue:rspec\n")),(0,o.kt)("p",null,"To find out which environment variable to use in place of ",(0,o.kt)("inlineCode",{parentName:"p"},"MY_CI_NODE_TOTAL"),", take a look at what Knapsack Pro uses as ",(0,o.kt)("inlineCode",{parentName:"p"},"node_total")," for your ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci"},"CI provider")," (e.g., for CircleCI it would be ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/KnapsackPro/knapsack_pro-ruby/blob/master/lib/knapsack_pro/config/ci/circle.rb#L6"},(0,o.kt)("inlineCode",{parentName:"a"},"CIRCLE_NODE_TOTAL")),")"),(0,o.kt)("h2",{id:"fail-the-ci-build-if-one-of-the-test-files-exceeds-a-certain-time-limit"},"Fail the CI build if one of the test files exceeds a certain time limit"),(0,o.kt)("p",null,"In the ",(0,o.kt)("a",{parentName:"p",href:"/ruby/hooks/"},(0,o.kt)("inlineCode",{parentName:"a"},"after_queue"))," hook, retrieve the slowest test file and create a file on disk if it exceeds a given ",(0,o.kt)("inlineCode",{parentName:"p"},"THRESHOLD"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ruby"},"KnapsackPro::Hooks::Queue.after_queue do |queue_id|\n  THRESHOLD = 120 # seconds\n\n  # all recorded test files by knapsack_pro gem on particular CI node index\n  slowest = Dir.glob(\".knapsack_pro/queue/#{queue_id}/*.json\")\n    .flat_map { |file| JSON.parse(File.read(file)) }\n    .max_by { |test_file| test_file['time_execution'] }\n\n  if slowest['time_execution'].to_f > THRESHOLD\n    puts '!' * 50\n    puts \"The slowest test file (#{slowest['path']}) took #{slowest['time_execution']} seconds and exceeded the threshold (#{THRESHOLD} seconds).\"\n    puts '!' * 50\n\n    File.open('tmp/slowest_test_file_exceeded_threshold.txt', 'w+') do |file|\n      file.write(slowest.to_json)\n    end\n  end\nend\n")),(0,o.kt)("p",null,"Then, in a bash script fail the CI build if the file exists:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'#!/bin/bash\n\nTHRESHOLD_FILE_PATH="tmp/slowest_test_file_exceeded_threshold.txt"\n\nif [ -f "$THRESHOLD_FILE_PATH" ]; then\n  rm "$THRESHOLD_FILE_PATH"\n  cat "$THRESHOLD_FILE_PATH"\n  echo "Slow test file exceeded threshold. Fail CI build."\n  exit 1\nfi\n')),(0,o.kt)("h2",{id:"run-multiple-test-commands-with-one-script"},"Run multiple test commands with one script"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'#!/bin/bash\n\n# Cucumber suite\nbundle exec rake knapsack_pro:queue:cucumber\nexport CUCUMBER_EXIT_CODE=$?\n\n# RSpec suite\nbundle exec rake knapsack_pro:queue:rspec\nexport RSPEC_EXIT_CODE=$?\n\nif [ "$CUCUMBER_EXIT_CODE" -ne "0" ]; then\n  exit $CUCUMBER_EXIT_CODE\nfi\n\nif [ "$RSPEC_EXIT_CODE" -ne "0" ]; then\n  exit $RSPEC_EXIT_CODE\nfi\n')),(0,o.kt)("h2",{id:"run-and-fail-fast-multiple-test-commands-with-one-script"},"Run (and fail fast) multiple test commands with one script"),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"CI nodes that fail on the first suite won't run the second suite: tests will be distributed to fewer CI nodes and the CI run will take longer.")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"#!/bin/bash\n\nset -e # exit on error\n\nbundle exec rake knapsack_pro:queue:rspec\nbundle exec rake knapsack_pro:queue:cucumber\n")),(0,o.kt)("h2",{id:"related-faqs"},"Related FAQs"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-run-knapsack_pro-only-on-a-few-parallel-ci-nodes-instead-of-all"},"How to run ",(0,o.kt)("inlineCode",{parentName:"a"},"knapsack_pro")," only on a few parallel CI nodes instead of all?")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-fail-the-ci-build-if-one-of-the-test-files-duration-exceeds-a-certain-limit"},"How to fail the CI build if one of the test files duration exceeds a certain limit?")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-run-multiple-test-suite-commands-in-heroku-ci"},"How to run multiple test suite commands in Heroku CI?"))))}p.isMDXComponent=!0}}]);