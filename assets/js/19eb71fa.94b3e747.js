"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[75],{3905:(e,t,a)=>{a.d(t,{Zo:()=>_,kt:()=>d});var n=a(7294);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,n,l=function(e,t){if(null==e)return{};var a,n,l={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var o=n.createContext({}),s=function(e){var t=n.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},_=function(e){var t=s(e.components);return n.createElement(o.Provider,{value:t},e.children)},k={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,l=e.mdxType,r=e.originalType,o=e.parentName,_=p(e,["components","mdxType","originalType","parentName"]),u=s(a),d=l,c=u["".concat(o,".").concat(d)]||u[d]||k[d]||r;return a?n.createElement(c,i(i({ref:t},_),{},{components:a})):n.createElement(c,i({ref:t},_))}));function d(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=a.length,i=new Array(r);i[0]=u;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p.mdxType="string"==typeof e?e:l,i[1]=p;for(var s=2;s<r;s++)i[s]=a[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},7644:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>k,frontMatter:()=>r,metadata:()=>p,toc:()=>s});var n=a(7462),l=(a(7294),a(3905));const r={pagination_next:null,pagination_prev:null,toc_max_heading_level:2},i="Reference",p={unversionedId:"ruby/reference",id:"ruby/reference",title:"Reference",description:"You can configure things in two ways:",source:"@site/docs/ruby/reference.md",sourceDirName:"ruby",slug:"/ruby/reference",permalink:"/ruby/reference",draft:!1,editUrl:"https://github.com/KnapsackPro/docs.knapsackpro.com/tree/main/docusaurus/docs/ruby/reference.md",tags:[],version:"current",frontMatter:{pagination_next:null,pagination_prev:null,toc_max_heading_level:2},sidebar:"sidebar"},o={},s=[{value:"Command-line arguments",id:"command-line-arguments",level:2},{value:"<code>KNAPSACK_PRO_BRANCH</code>",id:"knapsack_pro_branch",level:2},{value:"<code>KNAPSACK_PRO_BRANCH_ENCRYPTED</code>",id:"knapsack_pro_branch_encrypted",level:2},{value:"<code>KNAPSACK_PRO_CI_NODE_BUILD_ID</code>",id:"knapsack_pro_ci_node_build_id",level:2},{value:"<code>KNAPSACK_PRO_CI_NODE_TOTAL</code>",id:"knapsack_pro_ci_node_total",level:2},{value:"<code>KNAPSACK_PRO_CI_NODE_INDEX</code>",id:"knapsack_pro_ci_node_index",level:2},{value:"<code>KNAPSACK_PRO_COMMIT_HASH</code>",id:"knapsack_pro_commit_hash",level:2},{value:"<code>KNAPSACK_PRO_ENDPOINT</code> (Internal)",id:"knapsack_pro_endpoint-internal",level:2},{value:"<code>KNAPSACK_PRO_FALLBACK_MODE_ENABLED</code>",id:"knapsack_pro_fallback_mode_enabled",level:2},{value:"Related FAQs",id:"related-faqs",level:3},{value:"<code>KNAPSACK_PRO_FIXED_QUEUE_SPLIT</code> (Queue Mode)",id:"knapsack_pro_fixed_queue_split-queue-mode",level:2},{value:"<code>KNAPSACK_PRO_FIXED_TEST_SUITE_SPLIT</code> (Regular Mode)",id:"knapsack_pro_fixed_test_suite_split-regular-mode",level:2},{value:"<code>KNAPSACK_PRO_LOG_DIR</code>",id:"knapsack_pro_log_dir",level:2},{value:"Related FAQs",id:"related-faqs-1",level:3},{value:"<code>KNAPSACK_PRO_LOG_LEVEL</code>",id:"knapsack_pro_log_level",level:2},{value:"Related FAQs",id:"related-faqs-2",level:3},{value:"<code>KNAPSACK_PRO_MAX_REQUEST_RETRIES</code>",id:"knapsack_pro_max_request_retries",level:2},{value:"<code>KNAPSACK_PRO_MODE</code> (Internal)",id:"knapsack_pro_mode-internal",level:2},{value:"<code>KNAPSACK_PRO_PROJECT_DIR</code>",id:"knapsack_pro_project_dir",level:2},{value:"<code>KNAPSACK_PRO_REPOSITORY_ADAPTER</code>",id:"knapsack_pro_repository_adapter",level:2},{value:"<code>KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES</code> (RSpec)",id:"knapsack_pro_rspec_split_by_test_examples-rspec",level:2},{value:"Related FAQs",id:"related-faqs-3",level:3},{value:"<code>KNAPSACK_PRO_SALT</code>",id:"knapsack_pro_salt",level:2},{value:"<code>KNAPSACK_PRO_TEST_DIR</code> (Cucumber)",id:"knapsack_pro_test_dir-cucumber",level:2},{value:"Related FAQs",id:"related-faqs-4",level:3},{value:"<code>KNAPSACK_PRO_SLOW_TEST_FILE_PATTERN</code> (Internal)",id:"knapsack_pro_slow_test_file_pattern-internal",level:2},{value:"<code>KNAPSACK_PRO_TEST_DIR</code> (RSpec)",id:"knapsack_pro_test_dir-rspec",level:2},{value:"Related FAQs",id:"related-faqs-5",level:3},{value:"<code>KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN</code>",id:"knapsack_pro_test_file_exclude_pattern",level:2},{value:"Related FAQs",id:"related-faqs-6",level:3},{value:"<code>KNAPSACK_PRO_TEST_FILE_LIST</code>",id:"knapsack_pro_test_file_list",level:2},{value:"Related FAQs",id:"related-faqs-7",level:3},{value:"<code>KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE</code>",id:"knapsack_pro_test_file_list_source_file",level:2},{value:"Related FAQs",id:"related-faqs-8",level:3},{value:"<code>KNAPSACK_PRO_TEST_FILE_PATTERN</code>",id:"knapsack_pro_test_file_pattern",level:2},{value:"Related FAQs",id:"related-faqs-9",level:3},{value:"<code>KNAPSACK_PRO_TEST_FILES_ENCRYPTED</code>",id:"knapsack_pro_test_files_encrypted",level:2}],_={toc:s};function k(e){let{components:t,...a}=e;return(0,l.kt)("wrapper",(0,n.Z)({},_,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"reference"},"Reference"),(0,l.kt)("p",null,"You can configure things in two ways:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Command-line arguments for the test runner"),(0,l.kt)("li",{parentName:"ul"},"Environment variables for Knapsack Pro")),(0,l.kt)("p",null,"Unless specified otherwise, everything on this page is environment variables."),(0,l.kt)("h2",{id:"command-line-arguments"},"Command-line arguments"),(0,l.kt)("p",null,"You can pass command-line arguments using the Rake argument syntax:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'bundle exec rake "knapsack_pro:rspec[--tag focus --profile]"\n# ==\nbundle exec rake rspec --tag focus --profile\n')),(0,l.kt)("p",null,"Or using the ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack-pro-binary"},(0,l.kt)("inlineCode",{parentName:"a"},"knapsack_pro")," binary"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'knapsack_pro rspec "--tag focus --profile"\n# ==\nbundle exec rake rspec --tag focus --profile\n')),(0,l.kt)("h2",{id:"knapsack_pro_branch"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_BRANCH")),(0,l.kt)("p",null,"Git branch under test."),(0,l.kt)("p",null,"You don't need to set it if either:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Your CI is one of the ",(0,l.kt)("a",{parentName:"li",href:"/knapsack_pro-ruby/guide/"},"supported CIs")),(0,l.kt)("li",{parentName:"ul"},"You are using ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_REPOSITORY_ADAPTER=git")," and ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_PROJECT_DIR"))),(0,l.kt)("h2",{id:"knapsack_pro_branch_encrypted"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_BRANCH_ENCRYPTED")),(0,l.kt)("p",null,"Enable ",(0,l.kt)("a",{parentName:"p",href:"/ruby/encryption/"},"Branch Name Encryption"),"."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"false")),(0,l.kt)("p",null,"Available: ",(0,l.kt)("inlineCode",{parentName:"p"},"false")," | ",(0,l.kt)("inlineCode",{parentName:"p"},"true")),(0,l.kt)("h2",{id:"knapsack_pro_ci_node_build_id"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_CI_NODE_BUILD_ID")),(0,l.kt)("p",null,"Unique ID that identifies a CI build. It must be the same for all the parallel CI nodes."),(0,l.kt)("p",null,"Default: Knapsack Pro will take it from the CI environment (see ",(0,l.kt)("a",{parentName:"p",href:"/knapsack_pro-ruby/guide/"},"supported CIs"),")"),(0,l.kt)("p",null,"If your CI is not supported, you may generate a build ID with ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_CI_NODE_BUILD_ID=$(openssl rand - base64 32)")," and make it available to all parallel nodes."),(0,l.kt)("h2",{id:"knapsack_pro_ci_node_total"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_CI_NODE_TOTAL")),(0,l.kt)("p",null,"Total number of parallel CI nodes."),(0,l.kt)("p",null,"Default: Knapsack Pro will take it from the CI environment (see ",(0,l.kt)("a",{parentName:"p",href:"/knapsack_pro-ruby/guide/"},"supported CIs"),")"),(0,l.kt)("p",null,"If your CI is not supported, you need to set it manually."),(0,l.kt)("h2",{id:"knapsack_pro_ci_node_index"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_CI_NODE_INDEX")),(0,l.kt)("p",null,"Index of current CI node (first should be 0, second should be 1, etc.)."),(0,l.kt)("p",null,"Default: Knapsack Pro will take it from the CI environment (see ",(0,l.kt)("a",{parentName:"p",href:"/knapsack_pro-ruby/guide/"},"supported CIs"),")"),(0,l.kt)("p",null,"If your CI is not supported, you need to set it manually."),(0,l.kt)("h2",{id:"knapsack_pro_commit_hash"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_COMMIT_HASH")),(0,l.kt)("p",null,"Hash of the commit under test."),(0,l.kt)("p",null,"You don't need to set it if either:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Your CI is one of the ",(0,l.kt)("a",{parentName:"li",href:"/knapsack_pro-ruby/guide/"},"supported CIs")),(0,l.kt)("li",{parentName:"ul"},"You are using ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_REPOSITORY_ADAPTER=git")," and ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_PROJECT_DIR"))),(0,l.kt)("h2",{id:"knapsack_pro_endpoint-internal"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_ENDPOINT")," (Internal)"),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"https://api.knapsackpro.com")),(0,l.kt)("h2",{id:"knapsack_pro_fallback_mode_enabled"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_FALLBACK_MODE_ENABLED")),(0,l.kt)("p",null,"Enable/disable ",(0,l.kt)("a",{parentName:"p",href:"/overview/#fallback-mode"},"Fallback Mode"),"."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"true")),(0,l.kt)("p",null,"Available:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"false"),": Knapsack Pro will fail the build after ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_MAX_REQUEST_RETRIES")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"true"),": Knapsack Pro will switch to Fallback Mode after ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_MAX_REQUEST_RETRIES"))),(0,l.kt)("h3",{id:"related-faqs"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/what-happens-when-knapsack-pro-api-is-not-availablenot-reachable-temporarily"},"What happens when Knapsack Pro API is not available/not reachable temporarily?"))),(0,l.kt)("h2",{id:"knapsack_pro_fixed_queue_split-queue-mode"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_FIXED_QUEUE_SPLIT")," (Queue Mode)"),(0,l.kt)("p",null,"Dynamic or fixed tests split when retrying a CI build."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"false")),(0,l.kt)("p",null,"Available:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"false"),": generate a new split when ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_CI_NODE_BUILD_ID")," changes (see what Knapsack Pro uses as ",(0,l.kt)("inlineCode",{parentName:"li"},"node_build_id")," for your ",(0,l.kt)("a",{parentName:"li",href:"https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci"},"CI provider"),")"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"true"),": if the triplet ",(0,l.kt)("inlineCode",{parentName:"li"},"(branch name, commit hash, number of nodes)")," was already split in a previous build use the same split, otherwise generate a new split")),(0,l.kt)("p",null,"Recommended:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"true")," when your CI allows retrying single CI nodes or if your CI nodes are spot instances/preemptible"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"true")," when your CI uses the same ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_CI_NODE_BUILD_ID")," on retries"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"false")," otherwise")),(0,l.kt)("h2",{id:"knapsack_pro_fixed_test_suite_split-regular-mode"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_FIXED_TEST_SUITE_SPLIT")," (Regular Mode)"),(0,l.kt)("p",null,"Dynamic or fixed tests split when retrying a CI build."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"true")),(0,l.kt)("p",null,"Available:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"false"),": generate a new split when ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_CI_NODE_BUILD_ID")," changes (see what Knapsack Pro uses as ",(0,l.kt)("inlineCode",{parentName:"li"},"node_build_id")," for your ",(0,l.kt)("a",{parentName:"li",href:"https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci"},"CI provider"),")"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"true"),": if the triplet ",(0,l.kt)("inlineCode",{parentName:"li"},"(branch name, commit hash, number of nodes)")," was already split in a previous build use the same split, otherwise generate a new split")),(0,l.kt)("p",null,"Recommended:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"true")," when your CI allows retrying single CI nodes or if your CI nodes are spot instances/preemptible"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"true")," when your CI uses the same ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_CI_NODE_BUILD_ID")," on retries"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"false")," otherwise")),(0,l.kt)("h2",{id:"knapsack_pro_log_dir"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_LOG_DIR")),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"stdout")),(0,l.kt)("p",null,"Available: ",(0,l.kt)("inlineCode",{parentName:"p"},"stdout")," | directory"),(0,l.kt)("p",null,"When ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_LOG_DIR=log"),", Knapsack Pro will write logs to the ",(0,l.kt)("inlineCode",{parentName:"p"},"log")," directory and append the CI node index to the name. For example:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"log/knapsack_pro_node_0.log")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"log/knapsack_pro_node_1.log"))),(0,l.kt)("h3",{id:"related-faqs-1"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-write-knapsack_pro-logs-to-a-file"},"How to write ",(0,l.kt)("inlineCode",{parentName:"a"},"knapsack_pro")," logs to a file?"))),(0,l.kt)("h2",{id:"knapsack_pro_log_level"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_LOG_LEVEL")),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"debug")),(0,l.kt)("p",null,"Available: ",(0,l.kt)("inlineCode",{parentName:"p"},"debug")," | ",(0,l.kt)("inlineCode",{parentName:"p"},"info")," | ",(0,l.kt)("inlineCode",{parentName:"p"},"warn")," | ",(0,l.kt)("inlineCode",{parentName:"p"},"error")," | ",(0,l.kt)("inlineCode",{parentName:"p"},"fatal")),(0,l.kt)("p",null,"Recommended: ",(0,l.kt)("inlineCode",{parentName:"p"},"debug")," when debugging issues, ",(0,l.kt)("inlineCode",{parentName:"p"},"info")," to know what Knapsack Pro is doing"),(0,l.kt)("h3",{id:"related-faqs-2"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-can-i-change-log-level"},"How can I change log level?"))),(0,l.kt)("h2",{id:"knapsack_pro_max_request_retries"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_MAX_REQUEST_RETRIES")),(0,l.kt)("p",null,"Max amount of request attempts to try before switching to ",(0,l.kt)("a",{parentName:"p",href:"/overview/#fallback-mode"},"Fallback Mode"),". Retries respect a linear back-off."),(0,l.kt)("p",null,"Default:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"6")," when ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_FALLBACK_MODE_ENABLED=false")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"6")," in Regular Mode"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"3")," otherwise")),(0,l.kt)("p",null,"Available: number"),(0,l.kt)("h2",{id:"knapsack_pro_mode-internal"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_MODE")," (Internal)"),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"production")),(0,l.kt)("p",null,"Available:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"production")," sets ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_ENDPOINT")," to ",(0,l.kt)("inlineCode",{parentName:"li"},"https://api.knapsackpro.com")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"development")," sets ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_ENDPOINT")," to ",(0,l.kt)("inlineCode",{parentName:"li"},"http://api.knapsackpro.test:3000")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"test")," sets ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_ENDPOINT")," to ",(0,l.kt)("inlineCode",{parentName:"li"},"https://api-staging.knapsackpro.com"))),(0,l.kt)("h2",{id:"knapsack_pro_project_dir"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_PROJECT_DIR")),(0,l.kt)("p",null,"Absolute path to the project directory (containing ",(0,l.kt)("inlineCode",{parentName:"p"},".git/"),") on the CI node."),(0,l.kt)("p",null,"Required with ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_REPOSITORY_ADAPTER=git"),"."),(0,l.kt)("p",null,"Default: not set"),(0,l.kt)("p",null,"Example: ",(0,l.kt)("inlineCode",{parentName:"p"},"/home/ubuntu/my-app-repository")),(0,l.kt)("h2",{id:"knapsack_pro_repository_adapter"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_REPOSITORY_ADAPTER")),(0,l.kt)("p",null,"Controls how Knapsack Pro sets ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_BRANCH")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_COMMIT_HASH"),"."),(0,l.kt)("p",null,"Default: not set"),(0,l.kt)("p",null,"Available:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"not set: Knapsack Pro will take ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_BRANCH")," and ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_COMMIT_HASH")," from the CI environment (see ",(0,l.kt)("a",{parentName:"li",href:"/knapsack_pro-ruby/guide/"},"supported CIs"),")"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"git")," (requires ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_PROJECT_DIR"),"): Knapsack Pro will set ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_BRANCH")," and ",(0,l.kt)("inlineCode",{parentName:"li"},"KNAPSACK_PRO_COMMIT_HASH")," using git on your CI")),(0,l.kt)("h2",{id:"knapsack_pro_rspec_split_by_test_examples-rspec"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES")," (RSpec)"),(0,l.kt)("p",null,"Parallelize test examples (instead of files) across CI nodes."),(0,l.kt)("admonition",{type:"caution"},(0,l.kt)("ul",{parentName:"admonition"},(0,l.kt)("li",{parentName:"ul"},"Requires RSpec >= 3.3.0"),(0,l.kt)("li",{parentName:"ul"},"Does not support ",(0,l.kt)("inlineCode",{parentName:"li"},"run_all_when_everything_filtered")),(0,l.kt)("li",{parentName:"ul"},"Does not support ",(0,l.kt)("inlineCode",{parentName:"li"},"--tag")))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true\n")),(0,l.kt)("p",null,"Make sure to read the details in ",(0,l.kt)("a",{parentName:"p",href:"/ruby/split-by-test-examples"},"Split by test examples"),"."),(0,l.kt)("h3",{id:"related-faqs-3"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it#warning-dont-use-deprecated-rspec-run_all_when_everything_filtered-option"},"How to split slow RSpec test files by test examples (by individual it)?"))),(0,l.kt)("h2",{id:"knapsack_pro_salt"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_SALT")),(0,l.kt)("p",null,"Salt to use to ",(0,l.kt)("a",{parentName:"p",href:"/ruby/encryption/"},"Encrypt Test File Names or Branch Names"),"."),(0,l.kt)("h2",{id:"knapsack_pro_test_dir-cucumber"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_TEST_DIR")," (Cucumber)"),(0,l.kt)("p",null,"Passed as-is to Cucumber's ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/cucumber/cucumber-ruby/blob/5220e53d91d5fb0dbca2eea1e650b54a83743a0c/lib/cucumber/cli/options.rb#L345"},(0,l.kt)("inlineCode",{parentName:"a"},"--require")),"."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"features")),(0,l.kt)("p",null,"Available: any folder or file relative to the root of your project"),(0,l.kt)("p",null,"Example:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'KNAPSACK_PRO_TEST_DIR="features/support/cucumber_config.rb"\n')),(0,l.kt)("h3",{id:"related-faqs-4"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-require-different-cucumber-config-files-in-isolation"},"How to require different Cucumber config files in isolation?"))),(0,l.kt)("h2",{id:"knapsack_pro_slow_test_file_pattern-internal"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_SLOW_TEST_FILE_PATTERN")," (Internal)"),(0,l.kt)("p",null,"Split by test examples only files matching the pattern (instead of letting Knapsack Pro decide for you)."),(0,l.kt)("p",null,"Requires ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true"),", and must be subset of ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_TEST_FILE_PATTERN"),"."),(0,l.kt)("p",null,"This is supposed to be used by gem developers for debugging Knapsack Pro. But if you decide to use it, ",(0,l.kt)("strong",{parentName:"p"},"provide a short list of slow test files"),". If the matched files are too many, the test suite may slow down or fail: the Knapsack Pro API could time out, or CI could run out of memory."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"nil")),(0,l.kt)("p",null,"Available: anything that ",(0,l.kt)("a",{parentName:"p",href:"https://ruby-doc.org/core-3.0.0/Dir.html#method-c-glob"},"Dir.glob")," accepts"),(0,l.kt)("p",null,"Example:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true \\\nKNAPSACK_PRO_SLOW_TEST_FILE_PATTERN="{spec/models/user_spec.rb,spec/controllers/**/*_spec.rb}"\n')),(0,l.kt)("p",null,"Make sure to read the details in ",(0,l.kt)("a",{parentName:"p",href:"/ruby/split-by-test-examples"},"Split by test examples"),"."),(0,l.kt)("h2",{id:"knapsack_pro_test_dir-rspec"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_TEST_DIR")," (RSpec)"),(0,l.kt)("p",null,"Passed as-is to RSpec's ",(0,l.kt)("a",{parentName:"p",href:"https://relishapp.com/rspec/rspec-core/v/3-0/docs/configuration/setting-the-default-spec-path"},(0,l.kt)("inlineCode",{parentName:"a"},"--default-path")),"."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"rspec")),(0,l.kt)("p",null,"Available: any folder relative to the root of your project that contains ",(0,l.kt)("inlineCode",{parentName:"p"},"spec_helper.rb")),(0,l.kt)("p",null,"Example:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'KNAPSACK_PRO_TEST_DIR=spec KNAPSACK_PRO_TEST_FILE_PATTERN="{spec,engines/*/spec}/**/*_spec.rb"\n')),(0,l.kt)("admonition",{type:"caution"},(0,l.kt)("p",{parentName:"admonition"},"You may need to make your test files require ",(0,l.kt)("inlineCode",{parentName:"p"},"spec_helper")," with:"),(0,l.kt)("pre",{parentName:"admonition"},(0,l.kt)("code",{parentName:"pre",className:"language-ruby"},"require_relative 'spec_helper' # \u2705 Good\n\nrequire 'spec_helper' # \u26d4\ufe0f Bad\n"))),(0,l.kt)("h3",{id:"related-faqs-5"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-can-i-run-tests-from-multiple-directories"},"How can I run tests from multiple directories?"))),(0,l.kt)("h2",{id:"knapsack_pro_test_file_exclude_pattern"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN")),(0,l.kt)("p",null,"Exclude tests matching a pattern. It can be used in tandem with ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_TEST_FILE_PATTERN"),"."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"nil")),(0,l.kt)("p",null,"Available: anything that ",(0,l.kt)("a",{parentName:"p",href:"https://ruby-doc.org/core-3.0.0/Dir.html#method-c-glob"},"Dir.glob")," accepts"),(0,l.kt)("p",null,"Hint: you can debug ",(0,l.kt)("inlineCode",{parentName:"p"},"Dir.glob(MY_GLOB)")," in irb or rails console"),(0,l.kt)("p",null,"Examples:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="spec/features/**{,/*/**}/*_spec.rb"\n\nKNAPSACK_PRO_TEST_FILE_PATTERN="spec/controllers/**{,/*/**}/*_spec.rb" \\\nKNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="spec/controllers/admin/**{,/*/**}/*_spec.rb"\n')),(0,l.kt)("h3",{id:"related-faqs-6"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-exclude-tests-from-running-them"},"How to exclude tests?")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/dir-glob-pattern-examples-for-knapsack_pro_test_file_pattern-and-knapsack_pro_test_file_exclude_pattern"},"Dir.glob pattern examples for ",(0,l.kt)("inlineCode",{parentName:"a"},"KNAPSACK_PRO_TEST_FILE_PATTERN")," and ",(0,l.kt)("inlineCode",{parentName:"a"},"KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN")))),(0,l.kt)("h2",{id:"knapsack_pro_test_file_list"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_TEST_FILE_LIST")),(0,l.kt)("p",null,"Comma-separated list of tests to run. When ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_TEST_FILE_LIST")," is set, both ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_TEST_FILE_PATTERN")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN")," are ignored."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"nil")),(0,l.kt)("p",null,"Example:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"KNAPSACK_PRO_TEST_FILE_LIST=spec/features/dashboard_spec.rb,spec/models/user.rb:10,spec/models/user.rb:29\n")),(0,l.kt)("h3",{id:"related-faqs-7"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-run-a-specific-list-of-test-files-or-only-some-tests-from-test-file"},"How to run a specific list of test files or only some tests from test file?"))),(0,l.kt)("h2",{id:"knapsack_pro_test_file_list_source_file"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE")),(0,l.kt)("p",null,"File containing the list of tests to run. When ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE")," is set, both ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_TEST_FILE_PATTERN")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN")," are ignored."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"nil")),(0,l.kt)("p",null,"Example:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE=spec/fixtures/list.txt\n\n# list.txt\n./spec/test1_spec.rb\nspec/test2_spec.rb[1]\n./spec/test3_spec.rb[1:2:3:4]\n./spec/test4_spec.rb:4\n./spec/test4_spec.rb:5\n")),(0,l.kt)("h3",{id:"related-faqs-8"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-run-a-specific-list-of-test-files-or-only-some-tests-from-test-file"},"How to run a specific list of test files or only some tests from test file?"))),(0,l.kt)("h2",{id:"knapsack_pro_test_file_pattern"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_TEST_FILE_PATTERN")),(0,l.kt)("admonition",{type:"caution"},(0,l.kt)("p",{parentName:"admonition"},"Make sure to match individual files by adding the suffix (e.g., ",(0,l.kt)("inlineCode",{parentName:"p"},"_spec.rb"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"_test.rb"),") so that Knapsack Pro can split by file and not by directory.")),(0,l.kt)("p",null,"Run tests matching a pattern. It can be used in tandem with ",(0,l.kt)("inlineCode",{parentName:"p"},"KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN"),"."),(0,l.kt)("p",null,"Default: all tests for the given test runner"),(0,l.kt)("p",null,"Available: anything that ",(0,l.kt)("a",{parentName:"p",href:"https://ruby-doc.org/core-3.0.0/Dir.html#method-c-glob"},"Dir.glob")," accepts"),(0,l.kt)("p",null,"Hint: you can debug ",(0,l.kt)("inlineCode",{parentName:"p"},"Dir.glob(MY_GLOB)")," in irb or rails console"),(0,l.kt)("p",null,"Examples:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'KNAPSACK_PRO_TEST_FILE_PATTERN="spec/system/**/*_spec.rb"\n\nKNAPSACK_PRO_TEST_DIR=spec KNAPSACK_PRO_TEST_FILE_PATTERN="{spec,engines/*/spec}/**/*_spec.rb"\n\nKNAPSACK_PRO_TEST_FILE_PATTERN="spec/controllers/**{,/*/**}/*_spec.rb" \\\nKNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="spec/controllers/admin/**{,/*/**}/*_spec.rb"\n')),(0,l.kt)("h3",{id:"related-faqs-9"},"Related FAQs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-run-tests-from-a-specific-directory-only-system-tests-or-features-specs"},"How to run tests from a specific directory (only system tests or features specs)?")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-can-i-run-tests-from-multiple-directories"},"How can I run tests from multiple directories?")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/how-to-exclude-tests-from-running-them"},"How to exclude tests?")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://knapsackpro.com/faq/question/dir-glob-pattern-examples-for-knapsack_pro_test_file_pattern-and-knapsack_pro_test_file_exclude_pattern"},"Dir.glob pattern examples for ",(0,l.kt)("inlineCode",{parentName:"a"},"KNAPSACK_PRO_TEST_FILE_PATTERN")," and ",(0,l.kt)("inlineCode",{parentName:"a"},"KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN")))),(0,l.kt)("h2",{id:"knapsack_pro_test_files_encrypted"},(0,l.kt)("inlineCode",{parentName:"h2"},"KNAPSACK_PRO_TEST_FILES_ENCRYPTED")),(0,l.kt)("p",null,"Enable ",(0,l.kt)("a",{parentName:"p",href:"/ruby/encryption/"},"Test File Names Encryption"),"."),(0,l.kt)("p",null,"Default: ",(0,l.kt)("inlineCode",{parentName:"p"},"false")),(0,l.kt)("p",null,"Available: ",(0,l.kt)("inlineCode",{parentName:"p"},"false")," | ",(0,l.kt)("inlineCode",{parentName:"p"},"true")))}k.isMDXComponent=!0}}]);