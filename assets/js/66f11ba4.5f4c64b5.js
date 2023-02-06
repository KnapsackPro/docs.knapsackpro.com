"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[467],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),c=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):p(p({},t),e)),r},l=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),m=c(r),d=a,k=m["".concat(i,".").concat(d)]||m[d]||u[d]||o;return r?n.createElement(k,p(p({ref:t},l),{},{components:r})):n.createElement(k,p({ref:t},l))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,p=new Array(o);p[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:a,p[1]=s;for(var c=2;c<o;c++)p[c]=r[c];return n.createElement.apply(null,p)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},7821:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>p,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const o={pagination_next:null,pagination_prev:null},p="Troubleshooting",s={unversionedId:"cypress/troubleshooting",id:"cypress/troubleshooting",title:"Troubleshooting",description:"Error with --project",source:"@site/docs/cypress/troubleshooting.md",sourceDirName:"cypress",slug:"/cypress/troubleshooting",permalink:"/cypress/troubleshooting",draft:!1,editUrl:"https://github.com/KnapsackPro/docs.knapsackpro.com/tree/main/docusaurus/docs/cypress/troubleshooting.md",tags:[],version:"current",frontMatter:{pagination_next:null,pagination_prev:null},sidebar:"sidebar"},i={},c=[{value:"Error with <code>--project</code>",id:"error-with---project",level:2},{value:"JavaScript heap out of memory",id:"javascript-heap-out-of-memory",level:2},{value:"Debug Knapsack Pro on your development environment/machine",id:"debug-knapsack-pro-on-your-development-environmentmachine",level:2},{value:"No tests are executed",id:"no-tests-are-executed",level:2},{value:"Related FAQs",id:"related-faqs",level:2}],l={toc:c};function u(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"troubleshooting"},"Troubleshooting"),(0,a.kt)("h2",{id:"error-with---project"},"Error with ",(0,a.kt)("inlineCode",{parentName:"h2"},"--project")),(0,a.kt)("p",null,"Please use ",(0,a.kt)("a",{parentName:"p",href:"/cypress/reference/#knapsack_pro_test_file_pattern"},(0,a.kt)("inlineCode",{parentName:"a"},"KNAPSACK_PRO_TEST_FILE_PATTERN"))," instead of ",(0,a.kt)("inlineCode",{parentName:"p"},"--project"),"."),(0,a.kt)("p",null,"If you really need to use ",(0,a.kt)("inlineCode",{parentName:"p"},"--project"),", you can do so with an NPM script:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  ...\n  "scripts": {\n    "knapsack-pro-cypress-subdirectory": "cd subdirectory && knapsack-pro-cypress"\n  }\n}\n')),(0,a.kt)("p",null,"and invoke it with:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"npm run knapsack-pro-cypress-for-subdirectory\n")),(0,a.kt)("h2",{id:"javascript-heap-out-of-memory"},"JavaScript heap out of memory"),(0,a.kt)("p",null,"You can increase the memory available to Node with ",(0,a.kt)("a",{parentName:"p",href:"https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-megabytes"},(0,a.kt)("inlineCode",{parentName:"a"},"--max_old_space_size")),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"export NODE_OPTIONS=--max_old_space_size=4096\n\n$(npm bin)/knapsack-pro-jest\n\n$(npm bin)/knapsack-pro-cypress\n")),(0,a.kt)("h2",{id:"debug-knapsack-pro-on-your-development-environmentmachine"},"Debug Knapsack Pro on your development environment/machine"),(0,a.kt)("p",null,"To reproduce what Knapsack Pro executed on a specific CI node, check out the same branch and run:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_TOKEN \\\nKNAPSACK_PRO_CI_NODE_INDEX=MY_INDEX \\\nKNAPSACK_PRO_CI_NODE_TOTAL=MY_TOTAL \\\nKNAPSACK_PRO_BRANCH=MY_BRANCH \\\nKNAPSACK_PRO_COMMIT_HASH=MY_COMMIT \\\nKNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \\\nKNAPSACK_PRO_FIXED_QUEUE_SPLIT=true \\\nKNAPSACK_PRO_TEST_FILE_PATTERN="cypress/e2e/**/*.{js,jsx,coffee,cjsx}" \\\n$(npm bin)/knapsack-pro-cypress\n')),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_CI_NODE_BUILD_ID")," must be the same as the CI build you are trying to reproduce (if it helps, take a look at what Knapsack Pro uses as ",(0,a.kt)("inlineCode",{parentName:"p"},"ciNodeBuildId")," for your ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers"},"CI provider"),")."),(0,a.kt)("h2",{id:"no-tests-are-executed"},"No tests are executed"),(0,a.kt)("p",null,"Make sure ",(0,a.kt)("a",{parentName:"p",href:"/cypress/reference/#knapsack_pro_test_file_pattern"},(0,a.kt)("inlineCode",{parentName:"a"},"KNAPSACK_PRO_TEST_FILE_PATTERN"))," is correct."),(0,a.kt)("h2",{id:"related-faqs"},"Related FAQs"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-run-cypress-tests-locally-with-knapsack-pro"},"How to run Cypress tests locally with Knapsack Pro?")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-run-tests-only-from-specific-directory-in-cypress"},"How to run tests only from a specific directory in Cypress? Define your test files pattern with ",(0,a.kt)("inlineCode",{parentName:"a"},"KNAPSACK_PRO_TEST_FILE_PATTERN"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/i-m-getting-an-error-when-i-run-cypress-with-the-project-option"},"I'm getting an error when I run Cypress with the ",(0,a.kt)("inlineCode",{parentName:"a"},"--project")," option")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/javascript-heap-out-of-memory-how-to-increase-the-max-memory-for-node-with-max_old_space_size"},"JavaScript heap out of memory - how to increase the max memory for Node with ",(0,a.kt)("inlineCode",{parentName:"a"},"max_old_space_size")))))}u.isMDXComponent=!0}}]);