"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[641],{3905:(e,n,r)=>{r.d(n,{Zo:()=>c,kt:()=>m});var t=r(7294);function a(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function i(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){a(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function p(e,n){if(null==e)return{};var r,t,a=function(e,n){if(null==e)return{};var r,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(a[r]=e[r]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=t.createContext({}),s=function(e){var n=t.useContext(u),r=n;return e&&(r="function"==typeof e?e(n):i(i({},n),e)),r},c=function(e){var n=s(e.components);return t.createElement(u.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),d=s(r),m=a,k=d["".concat(u,".").concat(m)]||d[m]||l[m]||o;return r?t.createElement(k,i(i({ref:n},c),{},{components:r})):t.createElement(k,i({ref:n},c))}));function m(e,n){var r=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var p={};for(var u in n)hasOwnProperty.call(n,u)&&(p[u]=n[u]);p.originalType=e,p.mdxType="string"==typeof e?e:a,i[1]=p;for(var s=2;s<o;s++)i[s]=r[s];return t.createElement.apply(null,i)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},7975:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>u,contentTitle:()=>i,default:()=>l,frontMatter:()=>o,metadata:()=>p,toc:()=>s});var t=r(7462),a=(r(7294),r(3905));const o={pagination_next:null,pagination_prev:null},i="Use Knapsack Pro with spring",p={unversionedId:"ruby/spring",id:"ruby/spring",title:"Use Knapsack Pro with spring",description:"If you are using Knapsack Pro in Queue Mode with Cucumber, read the dedicated section below.",source:"@site/docs/ruby/spring.md",sourceDirName:"ruby",slug:"/ruby/spring",permalink:"/ruby/spring",draft:!1,editUrl:"https://github.com/KnapsackPro/docs.knapsackpro.com/tree/main/docusaurus/docs/ruby/spring.md",tags:[],version:"current",frontMatter:{pagination_next:null,pagination_prev:null},sidebar:"sidebar"},u={},s=[{value:"Related FAQs",id:"related-faqs",level:2}],c={toc:s};function l(e){let{components:n,...r}=e;return(0,a.kt)("wrapper",(0,t.Z)({},c,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"use-knapsack-pro-with-spring"},"Use Knapsack Pro with ",(0,a.kt)("inlineCode",{parentName:"h1"},"spring")),(0,a.kt)("admonition",{type:"caution"},(0,a.kt)("p",{parentName:"admonition"},"If you are using Knapsack Pro in Queue Mode with Cucumber, read the dedicated section below.")),(0,a.kt)("p",null,"You can use ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/rails/spring"},"spring")," to load your tests faster with ",(0,a.kt)("inlineCode",{parentName:"p"},"knapsack_pro")," by prepending ",(0,a.kt)("inlineCode",{parentName:"p"},"bundle exec spring")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"bin/spring"),". For example, with ",(0,a.kt)("inlineCode",{parentName:"p"},"rspec")," you would:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# Knapsack Pro in Regular Mode\nbundle exec spring rake knapsack_pro:rspec\n\n# Knapsack Pro in Queue Mode\nbundle exec spring rake knapsack_pro:queue:rspec\n")),(0,a.kt)("h1",{id:"use-knapsack-pro-in-queue-mode-with-spring-and-cucumber"},"Use Knapsack Pro in Queue Mode with ",(0,a.kt)("inlineCode",{parentName:"h1"},"spring")," and Cucumber"),(0,a.kt)("p",null,"Make sure you have ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/jonleighton/spring-commands-cucumber"},(0,a.kt)("inlineCode",{parentName:"a"},"spring-commands-cucumber"))," installed and execute:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring\n# or\nexport KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring\n\nbundle exec rake knapsack_pro:queue:cucumber\n")),(0,a.kt)("h2",{id:"related-faqs"},"Related FAQs"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-use-spring-gem-with-knapsack-pro"},"How to use spring gem with Knapsack Pro?")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-use-spring-gem-to-run-cucumber-tests-faster-in-queue-mode"},"How to use spring gem to run Cucumber tests faster in Queue Mode?"))))}l.isMDXComponent=!0}}]);