import{o as t}from"./vendor-BfUC8jLb.js";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=63&s|128):55296==(64512&s)&&r+1<t.length&&56320==(64512&t.charCodeAt(r+1))?(s=65536+((1023&s)<<10)+(1023&t.charCodeAt(++r)),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=63&s|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=63&s|128)}return e},n={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<t.length;s+=3){const e=t[s],i=s+1<t.length,o=i?t[s+1]:0,a=s+2<t.length,c=a?t[s+2]:0,h=e>>2,u=(3&e)<<4|o>>4;let l=(15&o)<<2|c>>6,d=63&c;a||(d=64,i||(l=64)),r.push(n[h],n[u],n[l],n[d])}return r.join("")},encodeString(t,n){return this.HAS_NATIVE_SUPPORT&&!n?btoa(t):this.encodeByteArray(e(t),n)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):function(t){const e=[];let n=0,r=0;for(;n<t.length;){const s=t[n++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=t[n++];e[r++]=String.fromCharCode((31&s)<<6|63&i)}else if(s>239&&s<365){const i=((7&s)<<18|(63&t[n++])<<12|(63&t[n++])<<6|63&t[n++])-65536;e[r++]=String.fromCharCode(55296+(i>>10)),e[r++]=String.fromCharCode(56320+(1023&i))}else{const i=t[n++],o=t[n++];e[r++]=String.fromCharCode((15&s)<<12|(63&i)<<6|63&o)}}return e.join("")}(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<t.length;){const e=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const a=i<t.length?n[t.charAt(i)]:64;++i;const c=i<t.length?n[t.charAt(i)]:64;if(++i,null==e||null==o||null==a||null==c)throw new r;const h=e<<2|o>>4;if(s.push(h),64!==a){const t=o<<4&240|a>>2;if(s.push(t),64!==c){const t=a<<6&192|c;s.push(t)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class r extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const s=function(t){return function(t){const r=e(t);return n.encodeByteArray(r,!0)}(t).replace(/\./g,"")};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const i=()=>
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}().__FIREBASE_DEFAULTS__,o=()=>{if("undefined"==typeof document)return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(r){return}const e=t&&function(t){try{return n.decodeString(t,!0)}catch(r){console.error("base64Decode failed: ",r)}return null}(t[1]);return e&&JSON.parse(e)},a=()=>{try{return i()||(()=>{if("undefined"==typeof process||void 0===process.env)return;const t={}.__FIREBASE_DEFAULTS__;return t?JSON.parse(t):void 0})()||o()}catch(t){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`)}},c=t=>{const e=(t=>{var e,n;return null===(n=null===(e=a())||void 0===e?void 0:e.emulatorHosts)||void 0===n?void 0:n[t]})(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return"["===e[0]?[e.substring(1,n-1),r]:[e.substring(0,n),r]},h=()=>{var t;return null===(t=a())||void 0===t?void 0:t.config};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class u{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,n)=>{e?this.reject(e):this.resolve(n),"function"==typeof t&&(this.promise.catch(()=>{}),1===t.length?t(e):t(e,n))}}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function l(){return!function(){var t;const e=null===(t=a())||void 0===t?void 0:t.forceEnvironment;if("node"===e)return!0;if("browser"===e)return!1;try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(n){return!1}}()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}class d extends Error{constructor(t,e,n){super(e),this.code=t,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,d.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,f.prototype.create)}}class f{constructor(t,e,n){this.service=t,this.serviceName=e,this.errors=n}create(t,...e){const n=e[0]||{},r=`${this.service}/${t}`,s=this.errors[t],i=s?function(t,e){return t.replace(p,(t,n)=>{const r=e[n];return null!=r?String(r):`<${n}?>`})}(s,n):"Error",o=`${this.serviceName}: ${i} (${r}).`;return new d(r,o,n)}}const p=/\{\$([^}]+)}/g;function g(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const s of n){if(!r.includes(s))return!1;const n=t[s],i=e[s];if(m(n)&&m(i)){if(!g(n,i))return!1}else if(n!==i)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function m(t){return null!==t&&"object"==typeof t}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y(t){return t&&t._delegate?t._delegate:t}class v{constructor(t,e,n){this.name=t,this.instanceFactory=e,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const t=new u;if(this.instancesDeferred.set(e,t),this.isInitialized(e)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:e});n&&t.resolve(n)}catch(n){}}return this.instancesDeferred.get(e).promise}getImmediate(t){var e;const n=this.normalizeInstanceIdentifier(null==t?void 0:t.identifier),r=null!==(e=null==t?void 0:t.optional)&&void 0!==e&&e;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(r)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(r)return null;throw s}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,this.shouldAutoInitialize()){if(function(t){return"EAGER"===t.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t))try{this.getOrInitializeService({instanceIdentifier:w})}catch(e){}for(const[t,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const t=this.getOrInitializeService({instanceIdentifier:r});n.resolve(t)}catch(e){}}}}clearInstance(t=w){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...t.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return null!=this.component}isInitialized(t=w){return this.instances.has(t)}getOptions(t=w){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,n=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:e});for(const[s,i]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(s)&&i.resolve(r)}return r}onInit(t,e){var n;const r=this.normalizeInstanceIdentifier(e),s=null!==(n=this.onInitCallbacks.get(r))&&void 0!==n?n:new Set;s.add(t),this.onInitCallbacks.set(r,s);const i=this.instances.get(r);return i&&t(i,r),()=>{s.delete(t)}}invokeOnInitCallbacks(t,e){const n=this.onInitCallbacks.get(e);if(n)for(const s of n)try{s(t,e)}catch(r){}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let n=this.instances.get(t);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=t,r===w?void 0:r),options:e}),this.instances.set(t,n),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(n,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,n)}catch(s){}var r;return n||null}normalizeInstanceIdentifier(t=w){return this.component?this.component.multipleInstances?t:w:t}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class E{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new _(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var b;!function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"}(b||(b={}));const T={debug:b.DEBUG,verbose:b.VERBOSE,info:b.INFO,warn:b.WARN,error:b.ERROR,silent:b.SILENT},S=b.INFO,I={[b.DEBUG]:"log",[b.VERBOSE]:"log",[b.INFO]:"info",[b.WARN]:"warn",[b.ERROR]:"error"},C=(t,e,...n)=>{if(e<t.logLevel)return;const r=(new Date).toISOString(),s=I[e];if(!s)throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`);console[s](`[${r}]  ${t.name}:`,...n)};class A{constructor(t){this.name=t,this._logLevel=S,this._logHandler=C,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in b))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel="string"==typeof t?T[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if("function"!=typeof t)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,b.DEBUG,...t),this._logHandler(this,b.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,b.VERBOSE,...t),this._logHandler(this,b.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,b.INFO,...t),this._logHandler(this,b.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,b.WARN,...t),this._logHandler(this,b.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,b.ERROR,...t),this._logHandler(this,b.ERROR,...t)}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(function(t){const e=t.getComponent();return"VERSION"===(null==e?void 0:e.type)}(t)){const e=t.getImmediate();return`${e.library}/${e.version}`}return null}).filter(t=>t).join(" ")}}const k="@firebase/app",N="0.10.5",R=new A("@firebase/app"),x="@firebase/app-compat",O="@firebase/analytics-compat",L="@firebase/analytics",M="@firebase/app-check-compat",P="@firebase/app-check",F="@firebase/auth",V="@firebase/auth-compat",U="@firebase/database",B="@firebase/database-compat",j="@firebase/functions",q="@firebase/functions-compat",$="@firebase/installations",z="@firebase/installations-compat",K="@firebase/messaging",G="@firebase/messaging-compat",H="@firebase/performance",Q="@firebase/performance-compat",W="@firebase/remote-config",X="@firebase/remote-config-compat",Y="@firebase/storage",J="@firebase/storage-compat",Z="@firebase/firestore",tt="@firebase/vertexai-preview",et="@firebase/firestore-compat",nt="firebase",rt="[DEFAULT]",st={[k]:"fire-core",[x]:"fire-core-compat",[L]:"fire-analytics",[O]:"fire-analytics-compat",[P]:"fire-app-check",[M]:"fire-app-check-compat",[F]:"fire-auth",[V]:"fire-auth-compat",[U]:"fire-rtdb",[B]:"fire-rtdb-compat",[j]:"fire-fn",[q]:"fire-fn-compat",[$]:"fire-iid",[z]:"fire-iid-compat",[K]:"fire-fcm",[G]:"fire-fcm-compat",[H]:"fire-perf",[Q]:"fire-perf-compat",[W]:"fire-rc",[X]:"fire-rc-compat",[Y]:"fire-gcs",[J]:"fire-gcs-compat",[Z]:"fire-fst",[et]:"fire-fst-compat",[tt]:"fire-vertex","fire-js":"fire-js",[nt]:"fire-js-all"},it=new Map,ot=new Map,at=new Map;function ct(t,e){try{t.container.addComponent(e)}catch(n){R.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function ht(t){const e=t.name;if(at.has(e))return R.debug(`There were multiple attempts to register component ${e}.`),!1;at.set(e,t);for(const n of it.values())ct(n,t);for(const n of ot.values())ct(n,t);return!0}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ut=new f("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class lt{constructor(t,e,n){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},e),this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new v("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw ut.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dt(t,e={}){let n=t;if("object"!=typeof e){e={name:e}}const r=Object.assign({name:rt,automaticDataCollectionEnabled:!1},e),s=r.name;if("string"!=typeof s||!s)throw ut.create("bad-app-name",{appName:String(s)});if(n||(n=h()),!n)throw ut.create("no-options");const i=it.get(s);if(i){if(g(n,i.options)&&g(r,i.config))return i;throw ut.create("duplicate-app",{appName:s})}const o=new E(s);for(const c of at.values())o.addComponent(c);const a=new lt(n,r,o);return it.set(s,a),a}function ft(t,e,n){var r;let s=null!==(r=st[t])&&void 0!==r?r:t;n&&(s+=`-${n}`);const i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const t=[`Unable to register library "${s}" with version "${e}":`];return i&&t.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&t.push("and"),o&&t.push(`version name "${e}" contains illegal characters (whitespace or "/")`),void R.warn(t.join(" "))}ht(new v(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pt="firebase-heartbeat-store";let gt=null;function mt(){return gt||(gt=t("firebase-heartbeat-database",1,{upgrade:(t,e)=>{if(0===e)try{t.createObjectStore(pt)}catch(n){console.warn(n)}}}).catch(t=>{throw ut.create("idb-open",{originalErrorMessage:t.message})})),gt}async function yt(t,e){try{const n=(await mt()).transaction(pt,"readwrite"),r=n.objectStore(pt);await r.put(e,vt(t)),await n.done}catch(n){if(n instanceof d)R.warn(n.message);else{const t=ut.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});R.warn(t.message)}}}function vt(t){return`${t.name}!${t.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new Et(e),this._heartbeatsCachePromise=this._storage.read().then(t=>(this._heartbeatsCache=t,t))}async triggerHeartbeat(){var t,e;const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=_t();if((null!=(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)||(this._heartbeatsCache=await this._heartbeatsCachePromise,null!=(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)))&&this._heartbeatsCache.lastSentHeartbeatDate!==r&&!this._heartbeatsCache.heartbeats.some(t=>t.date===r))return this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(t=>{const e=new Date(t.date).valueOf();return Date.now()-e<=2592e6}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var t;if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const e=_t(),{heartbeatsToSend:n,unsentEntries:r}=function(t,e=1024){const n=[];let r=t.slice();for(const s of t){const t=n.find(t=>t.agent===s.agent);if(t){if(t.dates.push(s.date),bt(n)>e){t.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),bt(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),i=s(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}}function _t(){return(new Date).toISOString().substring(0,10)}class Et{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!function(){try{return"object"==typeof indexedDB}catch(t){return!1}}()&&new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var t;e((null===(t=s.error)||void 0===t?void 0:t.message)||"")}}catch(n){e(n)}}).then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const t=await async function(t){try{const e=(await mt()).transaction(pt),n=await e.objectStore(pt).get(vt(t));return await e.done,n}catch(e){if(e instanceof d)R.warn(e.message);else{const t=ut.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});R.warn(t.message)}}}(this.app);return(null==t?void 0:t.heartbeats)?t:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(t){var e;if(await this._canUseIndexedDBPromise){const n=await this.read();return yt(this.app,{lastSentHeartbeatDate:null!==(e=t.lastSentHeartbeatDate)&&void 0!==e?e:n.lastSentHeartbeatDate,heartbeats:t.heartbeats})}}async add(t){var e;if(await this._canUseIndexedDBPromise){const n=await this.read();return yt(this.app,{lastSentHeartbeatDate:null!==(e=t.lastSentHeartbeatDate)&&void 0!==e?e:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...t.heartbeats]})}}}function bt(t){return s(JSON.stringify({version:2,heartbeats:t})).length}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Tt;Tt="",ht(new v("platform-logger",t=>new D(t),"PRIVATE")),ht(new v("heartbeat",t=>new wt(t),"PRIVATE")),ft(k,N,Tt),ft(k,N,"esm2017"),ft("fire-js","");var St,It,Ct="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var t;
/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}function n(t,e,n){n||(n=0);var r=Array(16);if("string"==typeof e)for(var s=0;16>s;++s)r[s]=e.charCodeAt(n++)|e.charCodeAt(n++)<<8|e.charCodeAt(n++)<<16|e.charCodeAt(n++)<<24;else for(s=0;16>s;++s)r[s]=e[n++]|e[n++]<<8|e[n++]<<16|e[n++]<<24;e=t.g[0],n=t.g[1],s=t.g[2];var i=t.g[3],o=e+(i^n&(s^i))+r[0]+3614090360&4294967295;o=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=(n=(s=(i=(e=n+(o<<7&4294967295|o>>>25))+((o=i+(s^e&(n^s))+r[1]+3905402710&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(e^n))+r[2]+606105819&4294967295)<<17&4294967295|o>>>15))+((o=n+(e^s&(i^e))+r[3]+3250441966&4294967295)<<22&4294967295|o>>>10))+((o=e+(i^n&(s^i))+r[4]+4118548399&4294967295)<<7&4294967295|o>>>25))+((o=i+(s^e&(n^s))+r[5]+1200080426&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(e^n))+r[6]+2821735955&4294967295)<<17&4294967295|o>>>15))+((o=n+(e^s&(i^e))+r[7]+4249261313&4294967295)<<22&4294967295|o>>>10))+((o=e+(i^n&(s^i))+r[8]+1770035416&4294967295)<<7&4294967295|o>>>25))+((o=i+(s^e&(n^s))+r[9]+2336552879&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(e^n))+r[10]+4294925233&4294967295)<<17&4294967295|o>>>15))+((o=n+(e^s&(i^e))+r[11]+2304563134&4294967295)<<22&4294967295|o>>>10))+((o=e+(i^n&(s^i))+r[12]+1804603682&4294967295)<<7&4294967295|o>>>25))+((o=i+(s^e&(n^s))+r[13]+4254626195&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(e^n))+r[14]+2792965006&4294967295)<<17&4294967295|o>>>15))+((o=n+(e^s&(i^e))+r[15]+1236535329&4294967295)<<22&4294967295|o>>>10))+((o=e+(s^i&(n^s))+r[1]+4129170786&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(e^n))+r[6]+3225465664&4294967295)<<9&4294967295|o>>>23))+((o=s+(e^n&(i^e))+r[11]+643717713&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^e&(s^i))+r[0]+3921069994&4294967295)<<20&4294967295|o>>>12))+((o=e+(s^i&(n^s))+r[5]+3593408605&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(e^n))+r[10]+38016083&4294967295)<<9&4294967295|o>>>23))+((o=s+(e^n&(i^e))+r[15]+3634488961&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^e&(s^i))+r[4]+3889429448&4294967295)<<20&4294967295|o>>>12))+((o=e+(s^i&(n^s))+r[9]+568446438&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(e^n))+r[14]+3275163606&4294967295)<<9&4294967295|o>>>23))+((o=s+(e^n&(i^e))+r[3]+4107603335&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^e&(s^i))+r[8]+1163531501&4294967295)<<20&4294967295|o>>>12))+((o=e+(s^i&(n^s))+r[13]+2850285829&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(e^n))+r[2]+4243563512&4294967295)<<9&4294967295|o>>>23))+((o=s+(e^n&(i^e))+r[7]+1735328473&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^e&(s^i))+r[12]+2368359562&4294967295)<<20&4294967295|o>>>12))+((o=e+(n^s^i)+r[5]+4294588738&4294967295)<<4&4294967295|o>>>28))+((o=i+(e^n^s)+r[8]+2272392833&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^e^n)+r[11]+1839030562&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^e)+r[14]+4259657740&4294967295)<<23&4294967295|o>>>9))+((o=e+(n^s^i)+r[1]+2763975236&4294967295)<<4&4294967295|o>>>28))+((o=i+(e^n^s)+r[4]+1272893353&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^e^n)+r[7]+4139469664&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^e)+r[10]+3200236656&4294967295)<<23&4294967295|o>>>9))+((o=e+(n^s^i)+r[13]+681279174&4294967295)<<4&4294967295|o>>>28))+((o=i+(e^n^s)+r[0]+3936430074&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^e^n)+r[3]+3572445317&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^e)+r[6]+76029189&4294967295)<<23&4294967295|o>>>9))+((o=e+(n^s^i)+r[9]+3654602809&4294967295)<<4&4294967295|o>>>28))+((o=i+(e^n^s)+r[12]+3873151461&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^e^n)+r[15]+530742520&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^e)+r[2]+3299628645&4294967295)<<23&4294967295|o>>>9))+((o=e+(s^(n|~i))+r[0]+4096336452&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(e|~s))+r[7]+1126891415&4294967295)<<10&4294967295|o>>>22))+((o=s+(e^(i|~n))+r[14]+2878612391&4294967295)<<15&4294967295|o>>>17))+((o=n+(i^(s|~e))+r[5]+4237533241&4294967295)<<21&4294967295|o>>>11))+((o=e+(s^(n|~i))+r[12]+1700485571&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(e|~s))+r[3]+2399980690&4294967295)<<10&4294967295|o>>>22))+((o=s+(e^(i|~n))+r[10]+4293915773&4294967295)<<15&4294967295|o>>>17))+((o=n+(i^(s|~e))+r[1]+2240044497&4294967295)<<21&4294967295|o>>>11))+((o=e+(s^(n|~i))+r[8]+1873313359&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(e|~s))+r[15]+4264355552&4294967295)<<10&4294967295|o>>>22))+((o=s+(e^(i|~n))+r[6]+2734768916&4294967295)<<15&4294967295|o>>>17))+((o=n+(i^(s|~e))+r[13]+1309151649&4294967295)<<21&4294967295|o>>>11))+((i=(e=n+((o=e+(s^(n|~i))+r[4]+4149444226&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(e|~s))+r[11]+3174756917&4294967295)<<10&4294967295|o>>>22))^((s=i+((o=s+(e^(i|~n))+r[2]+718787259&4294967295)<<15&4294967295|o>>>17))|~e))+r[9]+3951481745&4294967295,t.g[0]=t.g[0]+e&4294967295,t.g[1]=t.g[1]+(s+(o<<21&4294967295|o>>>11))&4294967295,t.g[2]=t.g[2]+s&4294967295,t.g[3]=t.g[3]+i&4294967295}function r(t,e){this.h=e;for(var n=[],r=!0,s=t.length-1;0<=s;s--){var i=0|t[s];r&&i==e||(n[s]=i,r=!1)}this.g=n}!function(t,e){function n(){}n.prototype=e.prototype,t.D=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.C=function(t,n,r){for(var s=Array(arguments.length-2),i=2;i<arguments.length;i++)s[i-2]=arguments[i];return e.prototype[n].apply(t,s)}}(e,function(){this.blockSize=-1}),e.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},e.prototype.u=function(t,e){void 0===e&&(e=t.length);for(var r=e-this.blockSize,s=this.B,i=this.h,o=0;o<e;){if(0==i)for(;o<=r;)n(this,t,o),o+=this.blockSize;if("string"==typeof t){for(;o<e;)if(s[i++]=t.charCodeAt(o++),i==this.blockSize){n(this,s),i=0;break}}else for(;o<e;)if(s[i++]=t[o++],i==this.blockSize){n(this,s),i=0;break}}this.h=i,this.o+=e},e.prototype.v=function(){var t=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);t[0]=128;for(var e=1;e<t.length-8;++e)t[e]=0;var n=8*this.o;for(e=t.length-8;e<t.length;++e)t[e]=255&n,n/=256;for(this.u(t),t=Array(16),e=n=0;4>e;++e)for(var r=0;32>r;r+=8)t[n++]=this.g[e]>>>r&255;return t};var s={};function i(t){return-128<=t&&128>t?function(t,e){var n=s;return Object.prototype.hasOwnProperty.call(n,t)?n[t]:n[t]=e(t)}(t,function(t){return new r([0|t],0>t?-1:0)}):new r([0|t],0>t?-1:0)}function o(t){if(isNaN(t)||!isFinite(t))return a;if(0>t)return d(o(-t));for(var e=[],n=1,s=0;t>=n;s++)e[s]=t/n|0,n*=4294967296;return new r(e,0)}var a=i(0),c=i(1),h=i(16777216);function u(t){if(0!=t.h)return!1;for(var e=0;e<t.g.length;e++)if(0!=t.g[e])return!1;return!0}function l(t){return-1==t.h}function d(t){for(var e=t.g.length,n=[],s=0;s<e;s++)n[s]=~t.g[s];return new r(n,~t.h).add(c)}function f(t,e){return t.add(d(e))}function p(t,e){for(;(65535&t[e])!=t[e];)t[e+1]+=t[e]>>>16,t[e]&=65535,e++}function g(t,e){this.g=t,this.h=e}function m(t,e){if(u(e))throw Error("division by zero");if(u(t))return new g(a,a);if(l(t))return e=m(d(t),e),new g(d(e.g),d(e.h));if(l(e))return e=m(t,d(e)),new g(d(e.g),e.h);if(30<t.g.length){if(l(t)||l(e))throw Error("slowDivide_ only works with positive integers.");for(var n=c,r=e;0>=r.l(t);)n=y(n),r=y(r);var s=v(n,1),i=v(r,1);for(r=v(r,2),n=v(n,2);!u(r);){var h=i.add(r);0>=h.l(t)&&(s=s.add(n),i=h),r=v(r,1),n=v(n,1)}return e=f(t,s.j(e)),new g(s,e)}for(s=a;0<=t.l(e);){for(n=Math.max(1,Math.floor(t.m()/e.m())),r=48>=(r=Math.ceil(Math.log(n)/Math.LN2))?1:Math.pow(2,r-48),h=(i=o(n)).j(e);l(h)||0<h.l(t);)h=(i=o(n-=r)).j(e);u(i)&&(i=c),s=s.add(i),t=f(t,h)}return new g(s,t)}function y(t){for(var e=t.g.length+1,n=[],s=0;s<e;s++)n[s]=t.i(s)<<1|t.i(s-1)>>>31;return new r(n,t.h)}function v(t,e){var n=e>>5;e%=32;for(var s=t.g.length-n,i=[],o=0;o<s;o++)i[o]=0<e?t.i(o+n)>>>e|t.i(o+n+1)<<32-e:t.i(o+n);return new r(i,t.h)}(t=r.prototype).m=function(){if(l(this))return-d(this).m();for(var t=0,e=1,n=0;n<this.g.length;n++){var r=this.i(n);t+=(0<=r?r:4294967296+r)*e,e*=4294967296}return t},t.toString=function(t){if(2>(t=t||10)||36<t)throw Error("radix out of range: "+t);if(u(this))return"0";if(l(this))return"-"+d(this).toString(t);for(var e=o(Math.pow(t,6)),n=this,r="";;){var s=m(n,e).g,i=((0<(n=f(n,s.j(e))).g.length?n.g[0]:n.h)>>>0).toString(t);if(u(n=s))return i+r;for(;6>i.length;)i="0"+i;r=i+r}},t.i=function(t){return 0>t?0:t<this.g.length?this.g[t]:this.h},t.l=function(t){return l(t=f(this,t))?-1:u(t)?0:1},t.abs=function(){return l(this)?d(this):this},t.add=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],s=0,i=0;i<=e;i++){var o=s+(65535&this.i(i))+(65535&t.i(i)),a=(o>>>16)+(this.i(i)>>>16)+(t.i(i)>>>16);s=a>>>16,o&=65535,a&=65535,n[i]=a<<16|o}return new r(n,-2147483648&n[n.length-1]?-1:0)},t.j=function(t){if(u(this)||u(t))return a;if(l(this))return l(t)?d(this).j(d(t)):d(d(this).j(t));if(l(t))return d(this.j(d(t)));if(0>this.l(h)&&0>t.l(h))return o(this.m()*t.m());for(var e=this.g.length+t.g.length,n=[],s=0;s<2*e;s++)n[s]=0;for(s=0;s<this.g.length;s++)for(var i=0;i<t.g.length;i++){var c=this.i(s)>>>16,f=65535&this.i(s),g=t.i(i)>>>16,m=65535&t.i(i);n[2*s+2*i]+=f*m,p(n,2*s+2*i),n[2*s+2*i+1]+=c*m,p(n,2*s+2*i+1),n[2*s+2*i+1]+=f*g,p(n,2*s+2*i+1),n[2*s+2*i+2]+=c*g,p(n,2*s+2*i+2)}for(s=0;s<e;s++)n[s]=n[2*s+1]<<16|n[2*s];for(s=e;s<2*e;s++)n[s]=0;return new r(n,0)},t.A=function(t){return m(this,t).h},t.and=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],s=0;s<e;s++)n[s]=this.i(s)&t.i(s);return new r(n,this.h&t.h)},t.or=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],s=0;s<e;s++)n[s]=this.i(s)|t.i(s);return new r(n,this.h|t.h)},t.xor=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],s=0;s<e;s++)n[s]=this.i(s)^t.i(s);return new r(n,this.h^t.h)},e.prototype.digest=e.prototype.v,e.prototype.reset=e.prototype.s,e.prototype.update=e.prototype.u,It=e,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.A,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=o,r.fromString=function t(e,n){if(0==e.length)throw Error("number format error: empty string");if(2>(n=n||10)||36<n)throw Error("radix out of range: "+n);if("-"==e.charAt(0))return d(t(e.substring(1),n));if(0<=e.indexOf("-"))throw Error('number format error: interior "-" character');for(var r=o(Math.pow(n,8)),s=a,i=0;i<e.length;i+=8){var c=Math.min(8,e.length-i),h=parseInt(e.substring(i,i+c),n);8>c?(c=o(Math.pow(n,c)),s=s.j(c).add(o(h))):s=(s=s.j(r)).add(o(h))}return s},St=r}).apply(void 0!==Ct?Ct:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var At,Dt,kt,Nt,Rt,xt,Ot,Lt,Mt,Pt="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var t,e="function"==typeof Object.defineProperties?Object.defineProperty:function(t,e,n){return t==Array.prototype||t==Object.prototype||(t[e]=n.value),t};var n=function(t){t=["object"==typeof globalThis&&globalThis,t,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof Pt&&Pt];for(var e=0;e<t.length;++e){var n=t[e];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);!function(t,r){if(r)t:{var s=n;t=t.split(".");for(var i=0;i<t.length-1;i++){var o=t[i];if(!(o in s))break t;s=s[o]}(r=r(i=s[t=t[t.length-1]]))!=i&&null!=r&&e(s,t,{configurable:!0,writable:!0,value:r})}}("Array.prototype.values",function(t){return t||function(){return function(t,e){t instanceof String&&(t+="");var n=0,r=!1,s={next:function(){if(!r&&n<t.length){var s=n++;return{value:e(s,t[s]),done:!1}}return r=!0,{done:!0,value:void 0}}};return s[Symbol.iterator]=function(){return s},s}(this,function(t,e){return e})}});
/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var r=r||{},s=this||self;function i(t){var e=typeof t;return"array"==(e="object"!=e?e:t?Array.isArray(t)?"array":e:"null")||"object"==e&&"number"==typeof t.length}function o(t){var e=typeof t;return"object"==e&&null!=t||"function"==e}function a(t,e,n){return t.call.apply(t.bind,arguments)}function c(t,e,n){if(!t)throw Error();if(2<arguments.length){var r=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,r),t.apply(e,n)}}return function(){return t.apply(e,arguments)}}function h(t,e,n){return(h=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?a:c).apply(null,arguments)}function u(t,e){var n=Array.prototype.slice.call(arguments,1);return function(){var e=n.slice();return e.push.apply(e,arguments),t.apply(this,e)}}function l(t,e){function n(){}n.prototype=e.prototype,t.aa=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.Qb=function(t,n,r){for(var s=Array(arguments.length-2),i=2;i<arguments.length;i++)s[i-2]=arguments[i];return e.prototype[n].apply(t,s)}}function d(t){const e=t.length;if(0<e){const n=Array(e);for(let r=0;r<e;r++)n[r]=t[r];return n}return[]}function f(t,e){for(let n=1;n<arguments.length;n++){const e=arguments[n];if(i(e)){const n=t.length||0,r=e.length||0;t.length=n+r;for(let s=0;s<r;s++)t[n+s]=e[s]}else t.push(e)}}function p(t){return/^[\s\xa0]*$/.test(t)}function g(){var t=s.navigator;return t&&(t=t.userAgent)?t:""}function m(t){return m[" "](t),t}m[" "]=function(){};var y=!(-1==g().indexOf("Gecko")||-1!=g().toLowerCase().indexOf("webkit")&&-1==g().indexOf("Edge")||-1!=g().indexOf("Trident")||-1!=g().indexOf("MSIE")||-1!=g().indexOf("Edge"));function v(t,e,n){for(const r in t)e.call(n,t[r],r,t)}function w(t){const e={};for(const n in t)e[n]=t[n];return e}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(t,e){let n,r;for(let s=1;s<arguments.length;s++){for(n in r=arguments[s],r)t[n]=r[n];for(let e=0;e<_.length;e++)n=_[e],Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}}function b(t){var e=1;t=t.split(":");const n=[];for(;0<e&&t.length;)n.push(t.shift()),e--;return t.length&&n.push(t.join(":")),n}function T(t){s.setTimeout(()=>{throw t},0)}function S(){var t=k;let e=null;return t.g&&(e=t.g,t.g=t.g.next,t.g||(t.h=null),e.next=null),e}var I=new class{constructor(t,e){this.i=t,this.j=e,this.h=0,this.g=null}get(){let t;return 0<this.h?(this.h--,t=this.g,this.g=t.next,t.next=null):t=this.i(),t}}(()=>new C,t=>t.reset());class C{constructor(){this.next=this.g=this.h=null}set(t,e){this.h=t,this.g=e,this.next=null}reset(){this.next=this.g=this.h=null}}let A,D=!1,k=new class{constructor(){this.h=this.g=null}add(t,e){const n=I.get();n.set(t,e),this.h?this.h.next=n:this.g=n,this.h=n}},N=()=>{const t=s.Promise.resolve(void 0);A=()=>{t.then(R)}};var R=()=>{for(var t;t=S();){try{t.h.call(t.g)}catch(n){T(n)}var e=I;e.j(t),100>e.h&&(e.h++,t.next=e.g,e.g=t)}D=!1};function x(){this.s=this.s,this.C=this.C}function O(t,e){this.type=t,this.g=this.target=e,this.defaultPrevented=!1}x.prototype.s=!1,x.prototype.ma=function(){this.s||(this.s=!0,this.N())},x.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},O.prototype.h=function(){this.defaultPrevented=!0};var L=function(){if(!s.addEventListener||!Object.defineProperty)return!1;var t=!1,e=Object.defineProperty({},"passive",{get:function(){t=!0}});try{const t=()=>{};s.addEventListener("test",t,e),s.removeEventListener("test",t,e)}catch(n){}return t}();function M(t,e){if(O.call(this,t?t.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,t){var n=this.type=t.type,r=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:null;if(this.target=t.target||t.srcElement,this.g=e,e=t.relatedTarget){if(y){t:{try{m(e.nodeName);var s=!0;break t}catch(i){}s=!1}s||(e=null)}}else"mouseover"==n?e=t.fromElement:"mouseout"==n&&(e=t.toElement);this.relatedTarget=e,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==t.clientX?t.clientX:t.pageX,this.clientY=void 0!==t.clientY?t.clientY:t.pageY,this.screenX=t.screenX||0,this.screenY=t.screenY||0),this.button=t.button,this.key=t.key||"",this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.pointerId=t.pointerId||0,this.pointerType="string"==typeof t.pointerType?t.pointerType:P[t.pointerType]||"",this.state=t.state,this.i=t,t.defaultPrevented&&M.aa.h.call(this)}}l(M,O);var P={2:"touch",3:"pen",4:"mouse"};M.prototype.h=function(){M.aa.h.call(this);var t=this.i;t.preventDefault?t.preventDefault():t.returnValue=!1};var F="closure_listenable_"+(1e6*Math.random()|0),V=0;function U(t,e,n,r,s){this.listener=t,this.proxy=null,this.src=e,this.type=n,this.capture=!!r,this.ha=s,this.key=++V,this.da=this.fa=!1}function B(t){t.da=!0,t.listener=null,t.proxy=null,t.src=null,t.ha=null}function j(t){this.src=t,this.g={},this.h=0}function q(t,e){var n=e.type;if(n in t.g){var r,s=t.g[n],i=Array.prototype.indexOf.call(s,e,void 0);(r=0<=i)&&Array.prototype.splice.call(s,i,1),r&&(B(e),0==t.g[n].length&&(delete t.g[n],t.h--))}}function $(t,e,n,r){for(var s=0;s<t.length;++s){var i=t[s];if(!i.da&&i.listener==e&&i.capture==!!n&&i.ha==r)return s}return-1}j.prototype.add=function(t,e,n,r,s){var i=t.toString();(t=this.g[i])||(t=this.g[i]=[],this.h++);var o=$(t,e,r,s);return-1<o?(e=t[o],n||(e.fa=!1)):((e=new U(e,this.src,i,!!r,s)).fa=n,t.push(e)),e};var z="closure_lm_"+(1e6*Math.random()|0),K={};function G(t,e,n,r,s){if(Array.isArray(e)){for(var i=0;i<e.length;i++)G(t,e[i],n,r,s);return null}return n=Z(n),t&&t[F]?t.K(e,n,!!o(r)&&!!r.capture,s):function(t,e,n,r,s,i){if(!e)throw Error("Invalid event type");var a=o(s)?!!s.capture:!!s,c=Y(t);if(c||(t[z]=c=new j(t)),n=c.add(e,n,r,a,i),n.proxy)return n;if(r=function(){function t(n){return e.call(t.src,t.listener,n)}const e=X;return t}(),n.proxy=r,r.src=t,r.listener=n,t.addEventListener)L||(s=a),void 0===s&&(s=!1),t.addEventListener(e.toString(),r,s);else if(t.attachEvent)t.attachEvent(W(e.toString()),r);else{if(!t.addListener||!t.removeListener)throw Error("addEventListener and attachEvent are unavailable.");t.addListener(r)}return n}(t,e,n,!1,r,s)}function H(t,e,n,r,s){if(Array.isArray(e))for(var i=0;i<e.length;i++)H(t,e[i],n,r,s);else r=o(r)?!!r.capture:!!r,n=Z(n),t&&t[F]?(t=t.i,(e=String(e).toString())in t.g&&(-1<(n=$(i=t.g[e],n,r,s))&&(B(i[n]),Array.prototype.splice.call(i,n,1),0==i.length&&(delete t.g[e],t.h--)))):t&&(t=Y(t))&&(e=t.g[e.toString()],t=-1,e&&(t=$(e,n,r,s)),(n=-1<t?e[t]:null)&&Q(n))}function Q(t){if("number"!=typeof t&&t&&!t.da){var e=t.src;if(e&&e[F])q(e.i,t);else{var n=t.type,r=t.proxy;e.removeEventListener?e.removeEventListener(n,r,t.capture):e.detachEvent?e.detachEvent(W(n),r):e.addListener&&e.removeListener&&e.removeListener(r),(n=Y(e))?(q(n,t),0==n.h&&(n.src=null,e[z]=null)):B(t)}}}function W(t){return t in K?K[t]:K[t]="on"+t}function X(t,e){if(t.da)t=!0;else{e=new M(e,this);var n=t.listener,r=t.ha||t.src;t.fa&&Q(t),t=n.call(r,e)}return t}function Y(t){return(t=t[z])instanceof j?t:null}var J="__closure_events_fn_"+(1e9*Math.random()>>>0);function Z(t){return"function"==typeof t?t:(t[J]||(t[J]=function(e){return t.handleEvent(e)}),t[J])}function tt(){x.call(this),this.i=new j(this),this.M=this,this.F=null}function et(t,e){var n,r=t.F;if(r)for(n=[];r;r=r.F)n.push(r);if(t=t.M,r=e.type||e,"string"==typeof e)e=new O(e,t);else if(e instanceof O)e.target=e.target||t;else{var s=e;E(e=new O(r,t),s)}if(s=!0,n)for(var i=n.length-1;0<=i;i--){var o=e.g=n[i];s=nt(o,r,!0,e)&&s}if(s=nt(o=e.g=t,r,!0,e)&&s,s=nt(o,r,!1,e)&&s,n)for(i=0;i<n.length;i++)s=nt(o=e.g=n[i],r,!1,e)&&s}function nt(t,e,n,r){if(!(e=t.i.g[String(e)]))return!0;e=e.concat();for(var s=!0,i=0;i<e.length;++i){var o=e[i];if(o&&!o.da&&o.capture==n){var a=o.listener,c=o.ha||o.src;o.fa&&q(t.i,o),s=!1!==a.call(c,r)&&s}}return s&&!r.defaultPrevented}function rt(t,e,n){if("function"==typeof t)n&&(t=h(t,n));else{if(!t||"function"!=typeof t.handleEvent)throw Error("Invalid listener argument");t=h(t.handleEvent,t)}return 2147483647<Number(e)?-1:s.setTimeout(t,e||0)}function st(t){t.g=rt(()=>{t.g=null,t.i&&(t.i=!1,st(t))},t.l);const e=t.h;t.h=null,t.m.apply(null,e)}l(tt,x),tt.prototype[F]=!0,tt.prototype.removeEventListener=function(t,e,n,r){H(this,t,e,n,r)},tt.prototype.N=function(){if(tt.aa.N.call(this),this.i){var t,e=this.i;for(t in e.g){for(var n=e.g[t],r=0;r<n.length;r++)B(n[r]);delete e.g[t],e.h--}}this.F=null},tt.prototype.K=function(t,e,n,r){return this.i.add(String(t),e,!1,n,r)},tt.prototype.L=function(t,e,n,r){return this.i.add(String(t),e,!0,n,r)};class it extends x{constructor(t,e){super(),this.m=t,this.l=e,this.h=null,this.i=!1,this.g=null}j(t){this.h=arguments,this.g?this.i=!0:st(this)}N(){super.N(),this.g&&(s.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ot(t){x.call(this),this.h=t,this.g={}}l(ot,x);var at=[];function ct(t){v(t.g,function(t,e){this.g.hasOwnProperty(e)&&Q(t)},t),t.g={}}ot.prototype.N=function(){ot.aa.N.call(this),ct(this)},ot.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ht=s.JSON.stringify,ut=s.JSON.parse,lt=class{stringify(t){return s.JSON.stringify(t,void 0)}parse(t){return s.JSON.parse(t,void 0)}};function dt(){}function ft(t){return t.h||(t.h=t.i())}function pt(){}dt.prototype.h=null;var gt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function mt(){O.call(this,"d")}function yt(){O.call(this,"c")}l(mt,O),l(yt,O);var vt={},wt=null;function _t(){return wt=wt||new tt}function Et(t){O.call(this,vt.La,t)}function bt(t){const e=_t();et(e,new Et(e))}function Tt(t,e){O.call(this,vt.STAT_EVENT,t),this.stat=e}function St(t){const e=_t();et(e,new Tt(e,t))}function It(t,e){O.call(this,vt.Ma,t),this.size=e}function Ct(t,e){if("function"!=typeof t)throw Error("Fn must not be null and must be a function");return s.setTimeout(function(){t()},e)}function Ft(){this.g=!0}function Vt(t,e,n,r){t.info(function(){return"XMLHTTP TEXT ("+e+"): "+function(t,e){if(!t.g)return e;if(!e)return null;try{var n=JSON.parse(e);if(n)for(t=0;t<n.length;t++)if(Array.isArray(n[t])){var r=n[t];if(!(2>r.length)){var s=r[1];if(Array.isArray(s)&&!(1>s.length)){var i=s[0];if("noop"!=i&&"stop"!=i&&"close"!=i)for(var o=1;o<s.length;o++)s[o]=""}}}return ht(n)}catch(a){return e}}(t,n)+(r?" "+r:"")})}vt.La="serverreachability",l(Et,O),vt.STAT_EVENT="statevent",l(Tt,O),vt.Ma="timingevent",l(It,O),Ft.prototype.xa=function(){this.g=!1},Ft.prototype.info=function(){};var Bt,jt={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},qt={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"};function $t(){}function zt(t,e,n,r){this.j=t,this.i=e,this.l=n,this.R=r||1,this.U=new ot(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Kt}function Kt(){this.i=null,this.g="",this.h=!1}l($t,dt),$t.prototype.g=function(){return new XMLHttpRequest},$t.prototype.i=function(){return{}},Bt=new $t;var Gt={},Ht={};function Qt(t,e,n){t.L=1,t.v=_e(ge(e)),t.m=n,t.P=!0,Wt(t,null)}function Wt(t,e){t.F=Date.now(),Jt(t),t.A=ge(t.v);var n=t.A,r=t.R;Array.isArray(r)||(r=[String(r)]),Le(n.i,"t",r),t.C=0,n=t.j.J,t.h=new Kt,t.g=bn(t.j,n?e:null,!t.m),0<t.O&&(t.M=new it(h(t.Y,t,t.g),t.O)),e=t.U,n=t.g,r=t.ca;var s="readystatechange";Array.isArray(s)||(s&&(at[0]=s.toString()),s=at);for(var i=0;i<s.length;i++){var o=G(n,s[i],r||e.handleEvent,!1,e.h||e);if(!o)break;e.g[o.key]=o}e=t.H?w(t.H):{},t.m?(t.u||(t.u="POST"),e["Content-Type"]="application/x-www-form-urlencoded",t.g.ea(t.A,t.u,t.m,e)):(t.u="GET",t.g.ea(t.A,t.u,null,e)),bt(),function(t,e,n,r,s,i){t.info(function(){if(t.g)if(i)for(var o="",a=i.split("&"),c=0;c<a.length;c++){var h=a[c].split("=");if(1<h.length){var u=h[0];h=h[1];var l=u.split("_");o=2<=l.length&&"type"==l[1]?o+(u+"=")+h+"&":o+(u+"=redacted&")}}else o=null;else o=i;return"XMLHTTP REQ ("+r+") [attempt "+s+"]: "+e+"\n"+n+"\n"+o})}(t.i,t.u,t.A,t.l,t.R,t.m)}function Xt(t){return!!t.g&&("GET"==t.u&&2!=t.L&&t.j.Ca)}function Yt(t,e){var n=t.C,r=e.indexOf("\n",n);return-1==r?Ht:(n=Number(e.substring(n,r)),isNaN(n)?Gt:(r+=1)+n>e.length?Ht:(e=e.slice(r,r+n),t.C=r+n,e))}function Jt(t){t.S=Date.now()+t.I,Zt(t,t.I)}function Zt(t,e){if(null!=t.B)throw Error("WatchDog timer not null");t.B=Ct(h(t.ba,t),e)}function te(t){t.B&&(s.clearTimeout(t.B),t.B=null)}function ee(t){0==t.j.G||t.J||yn(t.j,t)}function ne(t){te(t);var e=t.M;e&&"function"==typeof e.ma&&e.ma(),t.M=null,ct(t.U),t.g&&(e=t.g,t.g=null,e.abort(),e.ma())}function re(t,e){try{var n=t.j;if(0!=n.G&&(n.g==t||ce(n.h,t)))if(!t.K&&ce(n.h,t)&&3==n.G){try{var r=n.Da.g.parse(e)}catch(u){r=null}if(Array.isArray(r)&&3==r.length){var s=r;if(0==s[0]){t:if(!n.u){if(n.g){if(!(n.g.F+3e3<t.F))break t;mn(n),on(n)}fn(n),St(18)}}else n.za=s[1],0<n.za-n.T&&37500>s[2]&&n.F&&0==n.v&&!n.C&&(n.C=Ct(h(n.Za,n),6e3));if(1>=ae(n.h)&&n.ca){try{n.ca()}catch(u){}n.ca=void 0}}else wn(n,11)}else if((t.K||n.g==t)&&mn(n),!p(e))for(s=n.Da.g.parse(e),e=0;e<s.length;e++){let h=s[e];if(n.T=h[0],h=h[1],2==n.G)if("c"==h[0]){n.K=h[1],n.ia=h[2];const e=h[3];null!=e&&(n.la=e,n.j.info("VER="+n.la));const s=h[4];null!=s&&(n.Aa=s,n.j.info("SVER="+n.Aa));const u=h[5];null!=u&&"number"==typeof u&&0<u&&(r=1.5*u,n.L=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const l=t.g;if(l){const t=l.g?l.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(t){var i=r.h;i.g||-1==t.indexOf("spdy")&&-1==t.indexOf("quic")&&-1==t.indexOf("h2")||(i.j=i.l,i.g=new Set,i.h&&(he(i,i.h),i.h=null))}if(r.D){const t=l.g?l.g.getResponseHeader("X-HTTP-Session-Id"):null;t&&(r.ya=t,we(r.I,r.D,t))}}n.G=3,n.l&&n.l.ua(),n.ba&&(n.R=Date.now()-t.F,n.j.info("Handshake RTT: "+n.R+"ms"));var o=t;if((r=n).qa=En(r,r.J?r.ia:null,r.W),o.K){ue(r.h,o);var a=o,c=r.L;c&&(a.I=c),a.B&&(te(a),Jt(a)),r.g=o}else dn(r);0<n.i.length&&cn(n)}else"stop"!=h[0]&&"close"!=h[0]||wn(n,7);else 3==n.G&&("stop"==h[0]||"close"==h[0]?"stop"==h[0]?wn(n,7):sn(n):"noop"!=h[0]&&n.l&&n.l.ta(h),n.v=0)}bt()}catch(u){}}zt.prototype.ca=function(t){t=t.target;const e=this.M;e&&3==tn(t)?e.j():this.Y(t)},zt.prototype.Y=function(t){try{if(t==this.g)t:{const d=tn(this.g);var e=this.g.Ba();this.g.Z();if(!(3>d)&&(3!=d||this.g&&(this.h.h||this.g.oa()||en(this.g)))){this.J||4!=d||7==e||bt(),te(this);var n=this.g.Z();this.X=n;e:if(Xt(this)){var r=en(this.g);t="";var i=r.length,o=4==tn(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){ne(this),ee(this);var a="";break e}this.h.i=new s.TextDecoder}for(e=0;e<i;e++)this.h.h=!0,t+=this.h.i.decode(r[e],{stream:!(o&&e==i-1)});r.length=0,this.h.g+=t,this.C=0,a=this.h.g}else a=this.g.oa();if(this.o=200==n,function(t,e,n,r,s,i,o){t.info(function(){return"XMLHTTP RESP ("+r+") [ attempt "+s+"]: "+e+"\n"+n+"\n"+i+" "+o})}(this.i,this.u,this.A,this.l,this.R,d,n),this.o){if(this.T&&!this.K){e:{if(this.g){var c,h=this.g;if((c=h.g?h.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!p(c)){var u=c;break e}}u=null}if(!(n=u)){this.o=!1,this.s=3,St(12),ne(this),ee(this);break t}Vt(this.i,this.l,n,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,re(this,n)}if(this.P){let t;for(n=!0;!this.J&&this.C<a.length;){if(t=Yt(this,a),t==Ht){4==d&&(this.s=4,St(14),n=!1),Vt(this.i,this.l,null,"[Incomplete Response]");break}if(t==Gt){this.s=4,St(15),Vt(this.i,this.l,a,"[Invalid Chunk]"),n=!1;break}Vt(this.i,this.l,t,null),re(this,t)}if(Xt(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=d||0!=a.length||this.h.h||(this.s=1,St(16),n=!1),this.o=this.o&&n,n){if(0<a.length&&!this.W){this.W=!0;var l=this.j;l.g==this&&l.ba&&!l.M&&(l.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),pn(l),l.M=!0,St(11))}}else Vt(this.i,this.l,a,"[Invalid Chunked Response]"),ne(this),ee(this)}else Vt(this.i,this.l,a,null),re(this,a);4==d&&ne(this),this.o&&!this.J&&(4==d?yn(this.j,this):(this.o=!1,Jt(this)))}else(function(t){const e={};t=(t.g&&2<=tn(t)&&t.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<t.length;r++){if(p(t[r]))continue;var n=b(t[r]);const s=n[0];if("string"!=typeof(n=n[1]))continue;n=n.trim();const i=e[s]||[];e[s]=i,i.push(n)}!function(t,e){for(const n in t)e.call(void 0,t[n],n,t)}(e,function(t){return t.join(", ")})})(this.g),400==n&&0<a.indexOf("Unknown SID")?(this.s=3,St(12)):(this.s=0,St(13)),ne(this),ee(this)}}}catch(d){}},zt.prototype.cancel=function(){this.J=!0,ne(this)},zt.prototype.ba=function(){this.B=null;const t=Date.now();0<=t-this.S?(function(t,e){t.info(function(){return"TIMEOUT: "+e})}(this.i,this.A),2!=this.L&&(bt(),St(17)),ne(this),this.s=2,ee(this)):Zt(this,this.S-t)};var se=class{constructor(t,e){this.g=t,this.map=e}};function ie(t){this.l=t||10,s.PerformanceNavigationTiming?t=0<(t=s.performance.getEntriesByType("navigation")).length&&("hq"==t[0].nextHopProtocol||"h2"==t[0].nextHopProtocol):t=!!(s.chrome&&s.chrome.loadTimes&&s.chrome.loadTimes()&&s.chrome.loadTimes().wasFetchedViaSpdy),this.j=t?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function oe(t){return!!t.h||!!t.g&&t.g.size>=t.j}function ae(t){return t.h?1:t.g?t.g.size:0}function ce(t,e){return t.h?t.h==e:!!t.g&&t.g.has(e)}function he(t,e){t.g?t.g.add(e):t.h=e}function ue(t,e){t.h&&t.h==e?t.h=null:t.g&&t.g.has(e)&&t.g.delete(e)}function le(t){if(null!=t.h)return t.i.concat(t.h.D);if(null!=t.g&&0!==t.g.size){let e=t.i;for(const n of t.g.values())e=e.concat(n.D);return e}return d(t.i)}function de(t,e){if(t.forEach&&"function"==typeof t.forEach)t.forEach(e,void 0);else if(i(t)||"string"==typeof t)Array.prototype.forEach.call(t,e,void 0);else for(var n=function(t){if(t.na&&"function"==typeof t.na)return t.na();if(!t.V||"function"!=typeof t.V){if("undefined"!=typeof Map&&t instanceof Map)return Array.from(t.keys());if(!("undefined"!=typeof Set&&t instanceof Set)){if(i(t)||"string"==typeof t){var e=[];t=t.length;for(var n=0;n<t;n++)e.push(n);return e}e=[],n=0;for(const r in t)e[n++]=r;return e}}}(t),r=function(t){if(t.V&&"function"==typeof t.V)return t.V();if("undefined"!=typeof Map&&t instanceof Map||"undefined"!=typeof Set&&t instanceof Set)return Array.from(t.values());if("string"==typeof t)return t.split("");if(i(t)){for(var e=[],n=t.length,r=0;r<n;r++)e.push(t[r]);return e}for(r in e=[],n=0,t)e[n++]=t[r];return e}(t),s=r.length,o=0;o<s;o++)e.call(void 0,r[o],n&&n[o],t)}ie.prototype.cancel=function(){if(this.i=le(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const t of this.g.values())t.cancel();this.g.clear()}};var fe=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function pe(t){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,t instanceof pe){this.h=t.h,me(this,t.j),this.o=t.o,this.g=t.g,ye(this,t.s),this.l=t.l;var e=t.i,n=new Ne;n.i=e.i,e.g&&(n.g=new Map(e.g),n.h=e.h),ve(this,n),this.m=t.m}else t&&(e=String(t).match(fe))?(this.h=!1,me(this,e[1]||"",!0),this.o=Ee(e[2]||""),this.g=Ee(e[3]||"",!0),ye(this,e[4]),this.l=Ee(e[5]||"",!0),ve(this,e[6]||"",!0),this.m=Ee(e[7]||"")):(this.h=!1,this.i=new Ne(null,this.h))}function ge(t){return new pe(t)}function me(t,e,n){t.j=n?Ee(e,!0):e,t.j&&(t.j=t.j.replace(/:$/,""))}function ye(t,e){if(e){if(e=Number(e),isNaN(e)||0>e)throw Error("Bad port number "+e);t.s=e}else t.s=null}function ve(t,e,n){e instanceof Ne?(t.i=e,function(t,e){e&&!t.j&&(Re(t),t.i=null,t.g.forEach(function(t,e){var n=e.toLowerCase();e!=n&&(xe(this,e),Le(this,n,t))},t)),t.j=e}(t.i,t.h)):(n||(e=be(e,De)),t.i=new Ne(e,t.h))}function we(t,e,n){t.i.set(e,n)}function _e(t){return we(t,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),t}function Ee(t,e){return t?e?decodeURI(t.replace(/%25/g,"%2525")):decodeURIComponent(t):""}function be(t,e,n){return"string"==typeof t?(t=encodeURI(t).replace(e,Te),n&&(t=t.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t):null}function Te(t){return"%"+((t=t.charCodeAt(0))>>4&15).toString(16)+(15&t).toString(16)}pe.prototype.toString=function(){var t=[],e=this.j;e&&t.push(be(e,Ie,!0),":");var n=this.g;return(n||"file"==e)&&(t.push("//"),(e=this.o)&&t.push(be(e,Ie,!0),"@"),t.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.s)&&t.push(":",String(n))),(n=this.l)&&(this.g&&"/"!=n.charAt(0)&&t.push("/"),t.push(be(n,"/"==n.charAt(0)?Ae:Ce,!0))),(n=this.i.toString())&&t.push("?",n),(n=this.m)&&t.push("#",be(n,ke)),t.join("")};var Se,Ie=/[#\/\?@]/g,Ce=/[#\?:]/g,Ae=/[#\?]/g,De=/[#\?@]/g,ke=/#/g;function Ne(t,e){this.h=this.g=null,this.i=t||null,this.j=!!e}function Re(t){t.g||(t.g=new Map,t.h=0,t.i&&function(t,e){if(t){t=t.split("&");for(var n=0;n<t.length;n++){var r=t[n].indexOf("="),s=null;if(0<=r){var i=t[n].substring(0,r);s=t[n].substring(r+1)}else i=t[n];e(i,s?decodeURIComponent(s.replace(/\+/g," ")):"")}}}(t.i,function(e,n){t.add(decodeURIComponent(e.replace(/\+/g," ")),n)}))}function xe(t,e){Re(t),e=Me(t,e),t.g.has(e)&&(t.i=null,t.h-=t.g.get(e).length,t.g.delete(e))}function Oe(t,e){return Re(t),e=Me(t,e),t.g.has(e)}function Le(t,e,n){xe(t,e),0<n.length&&(t.i=null,t.g.set(Me(t,e),d(n)),t.h+=n.length)}function Me(t,e){return e=String(e),t.j&&(e=e.toLowerCase()),e}function Pe(t,e,n,r,s){try{s&&(s.onload=null,s.onerror=null,s.onabort=null,s.ontimeout=null),r(n)}catch(i){}}function Fe(){this.g=new lt}function Ve(t,e,n){const r=n||"";try{de(t,function(t,n){let s=t;o(t)&&(s=ht(t)),e.push(r+n+"="+encodeURIComponent(s))})}catch(s){throw e.push(r+"type="+encodeURIComponent("_badmap")),s}}function Ue(t){this.l=t.Ub||null,this.j=t.eb||!1}function Be(t,e){tt.call(this),this.D=t,this.o=e,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}function je(t){t.j.read().then(t.Pa.bind(t)).catch(t.ga.bind(t))}function qe(t){t.readyState=4,t.l=null,t.j=null,t.v=null,$e(t)}function $e(t){t.onreadystatechange&&t.onreadystatechange.call(t)}function ze(t){let e="";return v(t,function(t,n){e+=n,e+=":",e+=t,e+="\r\n"}),e}function Ke(t,e,n){t:{for(r in n){var r=!1;break t}r=!0}r||(n=ze(n),"string"==typeof t?null!=n&&encodeURIComponent(String(n)):we(t,e,n))}function Ge(t){tt.call(this),this.headers=new Map,this.o=t||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}(t=Ne.prototype).add=function(t,e){Re(this),this.i=null,t=Me(this,t);var n=this.g.get(t);return n||this.g.set(t,n=[]),n.push(e),this.h+=1,this},t.forEach=function(t,e){Re(this),this.g.forEach(function(n,r){n.forEach(function(n){t.call(e,n,r,this)},this)},this)},t.na=function(){Re(this);const t=Array.from(this.g.values()),e=Array.from(this.g.keys()),n=[];for(let r=0;r<e.length;r++){const s=t[r];for(let t=0;t<s.length;t++)n.push(e[r])}return n},t.V=function(t){Re(this);let e=[];if("string"==typeof t)Oe(this,t)&&(e=e.concat(this.g.get(Me(this,t))));else{t=Array.from(this.g.values());for(let n=0;n<t.length;n++)e=e.concat(t[n])}return e},t.set=function(t,e){return Re(this),this.i=null,Oe(this,t=Me(this,t))&&(this.h-=this.g.get(t).length),this.g.set(t,[e]),this.h+=1,this},t.get=function(t,e){return t&&0<(t=this.V(t)).length?String(t[0]):e},t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const t=[],e=Array.from(this.g.keys());for(var n=0;n<e.length;n++){var r=e[n];const i=encodeURIComponent(String(r)),o=this.V(r);for(r=0;r<o.length;r++){var s=i;""!==o[r]&&(s+="="+encodeURIComponent(String(o[r]))),t.push(s)}}return this.i=t.join("&")},l(Ue,dt),Ue.prototype.g=function(){return new Be(this.l,this.j)},Ue.prototype.i=(Se={},function(){return Se}),l(Be,tt),(t=Be.prototype).open=function(t,e){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.B=t,this.A=e,this.readyState=1,$e(this)},t.send=function(t){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;const e={headers:this.u,method:this.B,credentials:this.m,cache:void 0};t&&(e.body=t),(this.D||s).fetch(new Request(this.A,e)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,qe(this)),this.readyState=0},t.Sa=function(t){if(this.g&&(this.l=t,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=t.headers,this.readyState=2,$e(this)),this.g&&(this.readyState=3,$e(this),this.g)))if("arraybuffer"===this.responseType)t.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(void 0!==s.ReadableStream&&"body"in t){if(this.j=t.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;je(this)}else t.text().then(this.Ra.bind(this),this.ga.bind(this))},t.Pa=function(t){if(this.g){if(this.o&&t.value)this.response.push(t.value);else if(!this.o){var e=t.value?t.value:new Uint8Array(0);(e=this.v.decode(e,{stream:!t.done}))&&(this.response=this.responseText+=e)}t.done?qe(this):$e(this),3==this.readyState&&je(this)}},t.Ra=function(t){this.g&&(this.response=this.responseText=t,qe(this))},t.Qa=function(t){this.g&&(this.response=t,qe(this))},t.ga=function(){this.g&&qe(this)},t.setRequestHeader=function(t,e){this.u.append(t,e)},t.getResponseHeader=function(t){return this.h&&this.h.get(t.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const t=[],e=this.h.entries();for(var n=e.next();!n.done;)n=n.value,t.push(n[0]+": "+n[1]),n=e.next();return t.join("\r\n")},Object.defineProperty(Be.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(t){this.m=t?"include":"same-origin"}}),l(Ge,tt);var He=/^https?$/i,Qe=["POST","PUT"];function We(t,e){t.h=!1,t.g&&(t.j=!0,t.g.abort(),t.j=!1),t.l=e,t.m=5,Xe(t),Je(t)}function Xe(t){t.A||(t.A=!0,et(t,"complete"),et(t,"error"))}function Ye(t){if(t.h&&void 0!==r&&(!t.v[1]||4!=tn(t)||2!=t.Z()))if(t.u&&4==tn(t))rt(t.Ea,0,t);else if(et(t,"readystatechange"),4==tn(t)){t.h=!1;try{const r=t.Z();t:switch(r){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var e=!0;break t;default:e=!1}var n;if(!(n=e)){var i;if(i=0===r){var o=String(t.D).match(fe)[1]||null;!o&&s.self&&s.self.location&&(o=s.self.location.protocol.slice(0,-1)),i=!He.test(o?o.toLowerCase():"")}n=i}if(n)et(t,"complete"),et(t,"success");else{t.m=6;try{var a=2<tn(t)?t.g.statusText:""}catch(c){a=""}t.l=a+" ["+t.Z()+"]",Xe(t)}}finally{Je(t)}}}function Je(t,e){if(t.g){Ze(t);const r=t.g,s=t.v[0]?()=>{}:null;t.g=null,t.v=null,e||et(t,"ready");try{r.onreadystatechange=s}catch(n){}}}function Ze(t){t.I&&(s.clearTimeout(t.I),t.I=null)}function tn(t){return t.g?t.g.readyState:0}function en(t){try{if(!t.g)return null;if("response"in t.g)return t.g.response;switch(t.H){case"":case"text":return t.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in t.g)return t.g.mozResponseArrayBuffer}return null}catch(Ut){return null}}function nn(t,e,n){return n&&n.internalChannelParams&&n.internalChannelParams[t]||e}function rn(t){this.Aa=0,this.i=[],this.j=new Ft,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=nn("failFast",!1,t),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=nn("baseRetryDelayMs",5e3,t),this.cb=nn("retryDelaySeedMs",1e4,t),this.Wa=nn("forwardChannelMaxRetries",2,t),this.wa=nn("forwardChannelRequestTimeoutMs",2e4,t),this.pa=t&&t.xmlHttpFactory||void 0,this.Xa=t&&t.Tb||void 0,this.Ca=t&&t.useFetchStreams||!1,this.L=void 0,this.J=t&&t.supportsCrossDomainXhr||!1,this.K="",this.h=new ie(t&&t.concurrentRequestLimit),this.Da=new Fe,this.P=t&&t.fastHandshake||!1,this.O=t&&t.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=t&&t.Rb||!1,t&&t.xa&&this.j.xa(),t&&t.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&t&&t.detectBufferingProxy||!1,this.ja=void 0,t&&t.longPollingTimeout&&0<t.longPollingTimeout&&(this.ja=t.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}function sn(t){if(an(t),3==t.G){var e=t.U++,n=ge(t.I);if(we(n,"SID",t.K),we(n,"RID",e),we(n,"TYPE","terminate"),un(t,n),(e=new zt(t,t.j,e)).L=2,e.v=_e(ge(n)),n=!1,s.navigator&&s.navigator.sendBeacon)try{n=s.navigator.sendBeacon(e.v.toString(),"")}catch(r){}!n&&s.Image&&((new Image).src=e.v,n=!0),n||(e.g=bn(e.j,null),e.g.ea(e.v)),e.F=Date.now(),Jt(e)}_n(t)}function on(t){t.g&&(pn(t),t.g.cancel(),t.g=null)}function an(t){on(t),t.u&&(s.clearTimeout(t.u),t.u=null),mn(t),t.h.cancel(),t.s&&("number"==typeof t.s&&s.clearTimeout(t.s),t.s=null)}function cn(t){if(!oe(t.h)&&!t.s){t.s=!0;var e=t.Ga;A||N(),D||(A(),D=!0),k.add(e,t),t.B=0}}function hn(t,e){var n;n=e?e.l:t.U++;const r=ge(t.I);we(r,"SID",t.K),we(r,"RID",n),we(r,"AID",t.T),un(t,r),t.m&&t.o&&Ke(r,t.m,t.o),n=new zt(t,t.j,n,t.B+1),null===t.m&&(n.H=t.o),e&&(t.i=e.D.concat(t.i)),e=ln(t,n,1e3),n.I=Math.round(.5*t.wa)+Math.round(.5*t.wa*Math.random()),he(t.h,n),Qt(n,r,e)}function un(t,e){t.H&&v(t.H,function(t,n){we(e,n,t)}),t.l&&de({},function(t,n){we(e,n,t)})}function ln(t,e,n){n=Math.min(t.i.length,n);var r=t.l?h(t.l.Na,t.l,t):null;t:{var s=t.i;let e=-1;for(;;){const t=["count="+n];-1==e?0<n?(e=s[0].g,t.push("ofs="+e)):e=0:t.push("ofs="+e);let o=!0;for(let a=0;a<n;a++){let n=s[a].g;const c=s[a].map;if(n-=e,0>n)e=Math.max(0,s[a].g-100),o=!1;else try{Ve(c,t,"req"+n+"_")}catch(i){r&&r(c)}}if(o){r=t.join("&");break t}}}return t=t.i.splice(0,n),e.D=t,r}function dn(t){if(!t.g&&!t.u){t.Y=1;var e=t.Fa;A||N(),D||(A(),D=!0),k.add(e,t),t.v=0}}function fn(t){return!(t.g||t.u||3<=t.v)&&(t.Y++,t.u=Ct(h(t.Fa,t),vn(t,t.v)),t.v++,!0)}function pn(t){null!=t.A&&(s.clearTimeout(t.A),t.A=null)}function gn(t){t.g=new zt(t,t.j,"rpc",t.Y),null===t.m&&(t.g.H=t.o),t.g.O=0;var e=ge(t.qa);we(e,"RID","rpc"),we(e,"SID",t.K),we(e,"AID",t.T),we(e,"CI",t.F?"0":"1"),!t.F&&t.ja&&we(e,"TO",t.ja),we(e,"TYPE","xmlhttp"),un(t,e),t.m&&t.o&&Ke(e,t.m,t.o),t.L&&(t.g.I=t.L);var n=t.g;t=t.ia,n.L=1,n.v=_e(ge(e)),n.m=null,n.P=!0,Wt(n,t)}function mn(t){null!=t.C&&(s.clearTimeout(t.C),t.C=null)}function yn(t,e){var n=null;if(t.g==e){mn(t),pn(t),t.g=null;var r=2}else{if(!ce(t.h,e))return;n=e.D,ue(t.h,e),r=1}if(0!=t.G)if(e.o)if(1==r){n=e.m?e.m.length:0,e=Date.now()-e.F;var s=t.B;et(r=_t(),new It(r,n)),cn(t)}else dn(t);else if(3==(s=e.s)||0==s&&0<e.X||!(1==r&&function(t,e){return!(ae(t.h)>=t.h.j-(t.s?1:0)||(t.s?(t.i=e.D.concat(t.i),0):1==t.G||2==t.G||t.B>=(t.Va?0:t.Wa)||(t.s=Ct(h(t.Ga,t,e),vn(t,t.B)),t.B++,0)))}(t,e)||2==r&&fn(t)))switch(n&&0<n.length&&(e=t.h,e.i=e.i.concat(n)),s){case 1:wn(t,5);break;case 4:wn(t,10);break;case 3:wn(t,6);break;default:wn(t,2)}}function vn(t,e){let n=t.Ta+Math.floor(Math.random()*t.cb);return t.isActive()||(n*=2),n*e}function wn(t,e){if(t.j.info("Error code "+e),2==e){var n=h(t.fb,t),r=t.Xa;const e=!r;r=new pe(r||"//www.google.com/images/cleardot.gif"),s.location&&"http"==s.location.protocol||me(r,"https"),_e(r),e?function(t,e){const n=new Ft;if(s.Image){const r=new Image;r.onload=u(Pe,n,"TestLoadImage: loaded",!0,e,r),r.onerror=u(Pe,n,"TestLoadImage: error",!1,e,r),r.onabort=u(Pe,n,"TestLoadImage: abort",!1,e,r),r.ontimeout=u(Pe,n,"TestLoadImage: timeout",!1,e,r),s.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=t}else e(!1)}(r.toString(),n):function(t,e){new Ft;const n=new AbortController,r=setTimeout(()=>{n.abort(),Pe(0,0,!1,e)},1e4);fetch(t,{signal:n.signal}).then(t=>{clearTimeout(r),t.ok?Pe(0,0,!0,e):Pe(0,0,!1,e)}).catch(()=>{clearTimeout(r),Pe(0,0,!1,e)})}(r.toString(),n)}else St(2);t.G=0,t.l&&t.l.sa(e),_n(t),an(t)}function _n(t){if(t.G=0,t.ka=[],t.l){const e=le(t.h);0==e.length&&0==t.i.length||(f(t.ka,e),f(t.ka,t.i),t.h.i.length=0,d(t.i),t.i.length=0),t.l.ra()}}function En(t,e,n){var r=n instanceof pe?ge(n):new pe(n);if(""!=r.g)e&&(r.g=e+"."+r.g),ye(r,r.s);else{var i=s.location;r=i.protocol,e=e?e+"."+i.hostname:i.hostname,i=+i.port;var o=new pe(null);r&&me(o,r),e&&(o.g=e),i&&ye(o,i),n&&(o.l=n),r=o}return n=t.D,e=t.ya,n&&e&&we(r,n,e),we(r,"VER",t.la),un(t,r),r}function bn(t,e,n){if(e&&!t.J)throw Error("Can't create secondary domain capable XhrIo object.");return(e=t.Ca&&!t.pa?new Ge(new Ue({eb:n})):new Ge(t.pa)).Ha(t.J),e}function Tn(){}function Sn(){}function In(t,e){tt.call(this),this.g=new rn(e),this.l=t,this.h=e&&e.messageUrlParams||null,t=e&&e.messageHeaders||null,e&&e.clientProtocolHeaderRequired&&(t?t["X-Client-Protocol"]="webchannel":t={"X-Client-Protocol":"webchannel"}),this.g.o=t,t=e&&e.initMessageHeaders||null,e&&e.messageContentType&&(t?t["X-WebChannel-Content-Type"]=e.messageContentType:t={"X-WebChannel-Content-Type":e.messageContentType}),e&&e.va&&(t?t["X-WebChannel-Client-Profile"]=e.va:t={"X-WebChannel-Client-Profile":e.va}),this.g.S=t,(t=e&&e.Sb)&&!p(t)&&(this.g.m=t),this.v=e&&e.supportsCrossDomainXhr||!1,this.u=e&&e.sendRawJson||!1,(e=e&&e.httpSessionIdParam)&&!p(e)&&(this.g.D=e,null!==(t=this.h)&&e in t&&(e in(t=this.h)&&delete t[e])),this.j=new Dn(this)}function Cn(t){mt.call(this),t.__headers__&&(this.headers=t.__headers__,this.statusCode=t.__status__,delete t.__headers__,delete t.__status__);var e=t.__sm__;if(e){t:{for(const n in e){t=n;break t}t=void 0}(this.i=t)&&(t=this.i,e=null!==e&&t in e?e[t]:void 0),this.data=e}else this.data=t}function An(){yt.call(this),this.status=1}function Dn(t){this.g=t}(t=Ge.prototype).Ha=function(t){this.J=t},t.ea=function(t,e,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+t);e=e?e.toUpperCase():"GET",this.D=t,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Bt.g(),this.v=this.o?ft(this.o):ft(Bt),this.g.onreadystatechange=h(this.Ea,this);try{this.B=!0,this.g.open(e,String(t),!0),this.B=!1}catch(o){return void We(this,o)}if(t=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var i in r)n.set(i,r[i]);else{if("function"!=typeof r.keys||"function"!=typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const t of r.keys())n.set(t,r.get(t))}r=Array.from(n.keys()).find(t=>"content-type"==t.toLowerCase()),i=s.FormData&&t instanceof s.FormData,!(0<=Array.prototype.indexOf.call(Qe,e,void 0))||r||i||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[s,a]of n)this.g.setRequestHeader(s,a);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ze(this),this.u=!0,this.g.send(t),this.u=!1}catch(o){We(this,o)}},t.abort=function(t){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=t||7,et(this,"complete"),et(this,"abort"),Je(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Je(this,!0)),Ge.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Ye(this):this.bb())},t.bb=function(){Ye(this)},t.isActive=function(){return!!this.g},t.Z=function(){try{return 2<tn(this)?this.g.status:-1}catch(Se){return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch(Se){return""}},t.Oa=function(t){if(this.g){var e=this.g.responseText;return t&&0==e.indexOf(t)&&(e=e.substring(t.length)),ut(e)}},t.Ba=function(){return this.m},t.Ka=function(){return"string"==typeof this.l?this.l:String(this.l)},(t=rn.prototype).la=8,t.G=1,t.connect=function(t,e,n,r){St(0),this.W=t,this.H=e||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.I=En(this,null,this.W),cn(this)},t.Ga=function(t){if(this.s)if(this.s=null,1==this.G){if(!t){this.U=Math.floor(1e5*Math.random()),t=this.U++;const s=new zt(this,this.j,t);let i=this.o;if(this.S&&(i?(i=w(i),E(i,this.S)):i=this.S),null!==this.m||this.O||(s.H=i,i=null),this.P)t:{for(var e=0,n=0;n<this.i.length;n++){var r=this.i[n];if(void 0===(r="__data__"in r.map&&"string"==typeof(r=r.map.__data__)?r.length:void 0))break;if(4096<(e+=r)){e=n;break t}if(4096===e||n===this.i.length-1){e=n+1;break t}}e=1e3}else e=1e3;e=ln(this,s,e),we(n=ge(this.I),"RID",t),we(n,"CVER",22),this.D&&we(n,"X-HTTP-Session-Id",this.D),un(this,n),i&&(this.O?e="headers="+encodeURIComponent(String(ze(i)))+"&"+e:this.m&&Ke(n,this.m,i)),he(this.h,s),this.Ua&&we(n,"TYPE","init"),this.P?(we(n,"$req",e),we(n,"SID","null"),s.T=!0,Qt(s,n,null)):Qt(s,n,e),this.G=2}}else 3==this.G&&(t?hn(this,t):0==this.i.length||oe(this.h)||hn(this))},t.Fa=function(){if(this.u=null,gn(this),this.ba&&!(this.M||null==this.g||0>=this.R)){var t=2*this.R;this.j.info("BP detection timer enabled: "+t),this.A=Ct(h(this.ab,this),t)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,St(10),on(this),gn(this))},t.Za=function(){null!=this.C&&(this.C=null,on(this),fn(this),St(19))},t.fb=function(t){t?(this.j.info("Successfully pinged google.com"),St(2)):(this.j.info("Failed to ping google.com"),St(1))},t.isActive=function(){return!!this.l&&this.l.isActive(this)},(t=Tn.prototype).ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){},Sn.prototype.g=function(t,e){return new In(t,e)},l(In,tt),In.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},In.prototype.close=function(){sn(this.g)},In.prototype.o=function(t){var e=this.g;if("string"==typeof t){var n={};n.__data__=t,t=n}else this.u&&((n={}).__data__=ht(t),t=n);e.i.push(new se(e.Ya++,t)),3==e.G&&cn(e)},In.prototype.N=function(){this.g.l=null,delete this.j,sn(this.g),delete this.g,In.aa.N.call(this)},l(Cn,mt),l(An,yt),l(Dn,Tn),Dn.prototype.ua=function(){et(this.g,"a")},Dn.prototype.ta=function(t){et(this.g,new Cn(t))},Dn.prototype.sa=function(t){et(this.g,new An)},Dn.prototype.ra=function(){et(this.g,"b")},Sn.prototype.createWebChannel=Sn.prototype.g,In.prototype.send=In.prototype.o,In.prototype.open=In.prototype.m,In.prototype.close=In.prototype.close,Mt=function(){return new Sn},Lt=function(){return _t()},Ot=vt,xt={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},jt.NO_ERROR=0,jt.TIMEOUT=8,jt.HTTP_ERROR=6,Rt=jt,qt.COMPLETE="complete",Nt=qt,pt.EventType=gt,gt.OPEN="a",gt.CLOSE="b",gt.ERROR="c",gt.MESSAGE="d",tt.prototype.listen=tt.prototype.K,kt=pt,Dt=Ue,Ge.prototype.listenOnce=Ge.prototype.L,Ge.prototype.getLastError=Ge.prototype.Ka,Ge.prototype.getLastErrorCode=Ge.prototype.Ba,Ge.prototype.getStatus=Ge.prototype.Z,Ge.prototype.getResponseJson=Ge.prototype.Oa,Ge.prototype.getResponseText=Ge.prototype.oa,Ge.prototype.send=Ge.prototype.ea,Ge.prototype.setWithCredentials=Ge.prototype.Ha,At=Ge}).apply(void 0!==Pt?Pt:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});const Ft="@firebase/firestore";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(t){this.uid=t}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}Vt.UNAUTHENTICATED=new Vt(null),Vt.GOOGLE_CREDENTIALS=new Vt("google-credentials-uid"),Vt.FIRST_PARTY=new Vt("first-party-uid"),Vt.MOCK_USER=new Vt("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Ut="10.12.1";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bt=new A("@firebase/firestore");function jt(){return Bt.logLevel}function qt(t,...e){if(Bt.logLevel<=b.DEBUG){const n=e.map(Kt);Bt.debug(`Firestore (${Ut}): ${t}`,...n)}}function $t(t,...e){if(Bt.logLevel<=b.ERROR){const n=e.map(Kt);Bt.error(`Firestore (${Ut}): ${t}`,...n)}}function zt(t,...e){if(Bt.logLevel<=b.WARN){const n=e.map(Kt);Bt.warn(`Firestore (${Ut}): ${t}`,...n)}}function Kt(t){if("string"==typeof t)return t;try{
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return function(t){return JSON.stringify(t)}(t)}catch(e){return t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gt(t="Unexpected state"){const e=`FIRESTORE (${Ut}) INTERNAL ASSERTION FAILED: `+t;throw $t(e),new Error(e)}function Ht(t,e){t||Gt()}function Qt(t,e){return t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wt={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Xt extends d{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class Zt{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(Vt.UNAUTHENTICATED))}shutdown(){}}class te{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class ee{constructor(t){this.t=t,this.currentUser=Vt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){let n=this.i;const r=t=>this.i!==n?(n=this.i,e(t)):Promise.resolve();let s=new Yt;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Yt,t.enqueueRetryable(()=>r(this.currentUser))};const i=()=>{const e=s;t.enqueueRetryable(async()=>{await e.promise,await r(this.currentUser)})},o=t=>{qt("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=t,this.auth.addAuthTokenListener(this.o),i()};this.t.onInit(t=>o(t)),setTimeout(()=>{if(!this.auth){const t=this.t.getImmediate({optional:!0});t?o(t):(qt("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Yt)}},0),i()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(e=>this.i!==t?(qt("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):e?(Ht("string"==typeof e.accessToken),new Jt(e.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){const t=this.auth&&this.auth.getUid();return Ht(null===t||"string"==typeof t),new Vt(t)}}class ne{constructor(t,e,n){this.l=t,this.h=e,this.P=n,this.type="FirstParty",this.user=Vt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const t=this.T();return t&&this.I.set("Authorization",t),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class re{constructor(t,e,n){this.l=t,this.h=e,this.P=n}getToken(){return Promise.resolve(new ne(this.l,this.h,this.P))}start(t,e){t.enqueueRetryable(()=>e(Vt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class se{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ie{constructor(t){this.A=t,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(t,e){const n=t=>{null!=t.error&&qt("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${t.error.message}`);const n=t.token!==this.R;return this.R=t.token,qt("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?e(t.token):Promise.resolve()};this.o=e=>{t.enqueueRetryable(()=>n(e))};const r=t=>{qt("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=t,this.appCheck.addTokenListener(this.o)};this.A.onInit(t=>r(t)),setTimeout(()=>{if(!this.appCheck){const t=this.A.getImmediate({optional:!0});t?r(t):qt("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(t=>t?(Ht("string"==typeof t.token),this.R=t.token,new se(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oe(t){const e="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&"function"==typeof e.getRandomValues)e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(256/62);let n="";for(;n.length<20;){const r=oe(40);for(let s=0;s<r.length;++s)n.length<20&&r[s]<e&&(n+=t.charAt(r[s]%62))}return n}}function ce(t,e){return t<e?-1:t>e?1:0}function he(t,e,n){return t.length===e.length&&t.every((t,r)=>n(t,e[r]))}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue{constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new Xt(Wt.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new Xt(Wt.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<-62135596800)throw new Xt(Wt.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new Xt(Wt.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}static now(){return ue.fromMillis(Date.now())}static fromDate(t){return ue.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor(1e6*(t-1e3*e));return new ue(e,n)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(t){return this.seconds===t.seconds?ce(this.nanoseconds,t.nanoseconds):ce(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds- -62135596800;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(t){this.timestamp=t}static fromTimestamp(t){return new le(t)}static min(){return new le(new ue(0,0))}static max(){return new le(new ue(253402300799,999999999))}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(t,e,n){void 0===e?e=0:e>t.length&&Gt(),void 0===n?n=t.length-e:n>t.length-e&&Gt(),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return 0===de.comparator(this,t)}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof de?t.forEach(t=>{e.push(t)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=void 0===t?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return 0===this.length}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let r=0;r<n;r++){const n=t.get(r),s=e.get(r);if(n<s)return-1;if(n>s)return 1}return t.length<e.length?-1:t.length>e.length?1:0}}class fe extends de{construct(t,e,n){return new fe(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new Xt(Wt.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter(t=>t.length>0))}return new fe(e)}static emptyPath(){return new fe([])}}const pe=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ge extends de{construct(t,e,n){return new ge(t,e,n)}static isValidIdentifier(t){return pe.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ge.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&"__name__"===this.get(0)}static keyField(){return new ge(["__name__"])}static fromServerFormat(t){const e=[];let n="",r=0;const s=()=>{if(0===n.length)throw new Xt(Wt.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let i=!1;for(;r<t.length;){const e=t[r];if("\\"===e){if(r+1===t.length)throw new Xt(Wt.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const e=t[r+1];if("\\"!==e&&"."!==e&&"`"!==e)throw new Xt(Wt.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=e,r+=2}else"`"===e?(i=!i,r++):"."!==e||i?(n+=e,r++):(s(),r++)}if(s(),i)throw new Xt(Wt.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new ge(e)}static emptyPath(){return new ge([])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(t){this.path=t}static fromPath(t){return new me(fe.fromString(t))}static fromName(t){return new me(fe.fromString(t).popFirst(5))}static empty(){return new me(fe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return null!==t&&0===fe.comparator(this.path,t.path)}toString(){return this.path.toString()}static comparator(t,e){return fe.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new me(new fe(t.slice()))}}function ye(t){return new ve(t.readTime,t.key,-1)}class ve{constructor(t,e,n){this.readTime=t,this.documentKey=e,this.largestBatchId=n}static min(){return new ve(le.min(),me.empty(),-1)}static max(){return new ve(le.max(),me.empty(),-1)}}function we(t,e){let n=t.readTime.compareTo(e.readTime);return 0!==n?n:(n=me.comparator(t.documentKey,e.documentKey),0!==n?n:ce(t.largestBatchId,e.largestBatchId)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}class _e{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ee(t){if(t.code!==Wt.FAILED_PRECONDITION||"The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab."!==t.message)throw t;qt("LocalStore","Unexpectedly lost primary lease")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&Gt(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new be((n,r)=>{this.nextCallback=e=>{this.wrapSuccess(t,e).next(n,r)},this.catchCallback=t=>{this.wrapFailure(e,t).next(n,r)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof be?e:be.resolve(e)}catch(t){return be.reject(t)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):be.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):be.reject(e)}static resolve(t){return new be((e,n)=>{e(t)})}static reject(t){return new be((e,n)=>{n(t)})}static waitFor(t){return new be((e,n)=>{let r=0,s=0,i=!1;t.forEach(t=>{++r,t.next(()=>{++s,i&&s===r&&e()},t=>n(t))}),i=!0,s===r&&e()})}static or(t){let e=be.resolve(!1);for(const n of t)e=e.next(t=>t?be.resolve(t):n());return e}static forEach(t,e){const n=[];return t.forEach((t,r)=>{n.push(e.call(this,t,r))}),this.waitFor(n)}static mapArray(t,e){return new be((n,r)=>{const s=t.length,i=new Array(s);let o=0;for(let a=0;a<s;a++){const c=a;e(t[c]).next(t=>{i[c]=t,++o,o===s&&n(i)},t=>r(t))}})}static doWhile(t,e){return new be((n,r)=>{const s=()=>{!0===t()?e().next(()=>{s()},r):n()};s()})}}function Te(t){return"IndexedDbTransactionError"===t.name}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=t=>this.ie(t),this.se=t=>e.writeSequenceNumber(t))}ie(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.se&&this.se(t),t}}function Ie(t){return null==t}function Ce(t){return 0===t&&1/t==-1/0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ae(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function De(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function ke(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Se.oe=-1;class Ne{constructor(t,e){this.comparator=t,this.root=e||xe.EMPTY}insert(t,e){return new Ne(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,xe.BLACK,null,null))}remove(t){return new Ne(this.comparator,this.root.remove(t,this.comparator).copy(null,null,xe.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const n=this.comparator(t,e.key);if(0===n)return e.value;n<0?e=e.left:n>0&&(e=e.right)}return null}indexOf(t){let e=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(t,n.key);if(0===r)return e+n.left.size;r<0?n=n.left:(e+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,n)=>(t(e,n),!1))}toString(){const t=[];return this.inorderTraversal((e,n)=>(t.push(`${e}:${n}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Re(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Re(this.root,t,this.comparator,!1)}getReverseIterator(){return new Re(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Re(this.root,t,this.comparator,!0)}}class Re{constructor(t,e,n,r){this.isReverse=r,this.nodeStack=[];let s=1;for(;!t.isEmpty();)if(s=e?n(t.key,e):1,e&&r&&(s*=-1),s<0)t=this.isReverse?t.left:t.right;else{if(0===s){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class xe{constructor(t,e,n,r,s){this.key=t,this.value=e,this.color=null!=n?n:xe.RED,this.left=null!=r?r:xe.EMPTY,this.right=null!=s?s:xe.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,n,r,s){return new xe(null!=t?t:this.key,null!=e?e:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=s?s:this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,n){let r=this;const s=n(t,r.key);return r=s<0?r.copy(null,null,null,r.left.insert(t,e,n),null):0===s?r.copy(null,e,null,null,null):r.copy(null,null,null,null,r.right.insert(t,e,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return xe.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let n,r=this;if(e(t,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(t,e),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===e(t,r.key)){if(r.right.isEmpty())return xe.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(t,e))}return r.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,xe.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,xe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Gt();if(this.right.isRed())throw Gt();const t=this.left.check();if(t!==this.right.check())throw Gt();return t+(this.isRed()?0:1)}}xe.EMPTY=null,xe.RED=!0,xe.BLACK=!1,xe.EMPTY=new class{constructor(){this.size=0}get key(){throw Gt()}get value(){throw Gt()}get color(){throw Gt()}get left(){throw Gt()}get right(){throw Gt()}copy(t,e,n,r,s){return this}insert(t,e,n){return new xe(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Oe{constructor(t){this.comparator=t,this.data=new Ne(this.comparator)}has(t){return null!==this.data.get(t)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,n)=>(t(e),!1))}forEachInRange(t,e){const n=this.data.getIteratorFrom(t[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,t[1])>=0)return;e(r.key)}}forEachWhile(t,e){let n;for(n=void 0!==e?this.data.getIteratorFrom(e):this.data.getIterator();n.hasNext();)if(!t(n.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Le(this.data.getIterator())}getIteratorFrom(t){return new Le(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(t=>{e=e.add(t)}),e}isEqual(t){if(!(t instanceof Oe))return!1;if(this.size!==t.size)return!1;const e=this.data.getIterator(),n=t.data.getIterator();for(;e.hasNext();){const t=e.getNext().key,r=n.getNext().key;if(0!==this.comparator(t,r))return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new Oe(this.comparator);return e.data=t,e}}class Le{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(t){this.fields=t,t.sort(ge.comparator)}static empty(){return new Me([])}unionWith(t){let e=new Oe(ge.comparator);for(const n of this.fields)e=e.add(n);for(const n of t)e=e.add(n);return new Me(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return he(this.fields,t.fields,(t,e)=>t.isEqual(e))}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(t){try{return atob(t)}catch(t){throw"undefined"!=typeof DOMException&&t instanceof DOMException?new Pe("Invalid base64 string: "+t):t}}(t);return new Fe(e)}static fromUint8Array(t){const e=function(t){let e="";for(let n=0;n<t.length;++n)e+=String.fromCharCode(t[n]);return e}(t);return new Fe(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return t=this.binaryString,btoa(t);var t}toUint8Array(){return function(t){const e=new Uint8Array(t.length);for(let n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return ce(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Fe.EMPTY_BYTE_STRING=new Fe("");const Ve=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ue(t){if(Ht(!!t),"string"==typeof t){let e=0;const n=Ve.exec(t);if(Ht(!!n),n[1]){let t=n[1];t=(t+"000000000").substr(0,9),e=Number(t)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Be(t.seconds),nanos:Be(t.nanos)}}function Be(t){return"number"==typeof t?t:"string"==typeof t?Number(t):0}function je(t){return"string"==typeof t?Fe.fromBase64String(t):Fe.fromUint8Array(t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qe(t){var e,n;return"server_timestamp"===(null===(n=((null===(e=null==t?void 0:t.mapValue)||void 0===e?void 0:e.fields)||{}).__type__)||void 0===n?void 0:n.stringValue)}function $e(t){const e=t.mapValue.fields.__previous_value__;return qe(e)?$e(e):e}function ze(t){const e=Ue(t.mapValue.fields.__local_write_time__.timestampValue);return new ue(e.seconds,e.nanos)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(t,e,n,r,s,i,o,a,c){this.databaseId=t,this.appId=e,this.persistenceKey=n,this.host=r,this.ssl=s,this.forceLongPolling=i,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=c}}class Ge{constructor(t,e){this.projectId=t,this.database=e||"(default)"}static empty(){return new Ge("","")}get isDefaultDatabase(){return"(default)"===this.database}isEqual(t){return t instanceof Ge&&t.projectId===this.projectId&&t.database===this.database}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He={};function Qe(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?qe(t)?4:function(t){return"__max__"===(((t.mapValue||{}).fields||{}).__type__||{}).stringValue}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t)?9007199254740991:10:Gt()}function We(t,e){if(t===e)return!0;const n=Qe(t);if(n!==Qe(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return ze(t).isEqual(ze(e));case 3:return function(t,e){if("string"==typeof t.timestampValue&&"string"==typeof e.timestampValue&&t.timestampValue.length===e.timestampValue.length)return t.timestampValue===e.timestampValue;const n=Ue(t.timestampValue),r=Ue(e.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(t,e){return je(t.bytesValue).isEqual(je(e.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(t,e){return Be(t.geoPointValue.latitude)===Be(e.geoPointValue.latitude)&&Be(t.geoPointValue.longitude)===Be(e.geoPointValue.longitude)}(t,e);case 2:return function(t,e){if("integerValue"in t&&"integerValue"in e)return Be(t.integerValue)===Be(e.integerValue);if("doubleValue"in t&&"doubleValue"in e){const n=Be(t.doubleValue),r=Be(e.doubleValue);return n===r?Ce(n)===Ce(r):isNaN(n)&&isNaN(r)}return!1}(t,e);case 9:return he(t.arrayValue.values||[],e.arrayValue.values||[],We);case 10:return function(t,e){const n=t.mapValue.fields||{},r=e.mapValue.fields||{};if(Ae(n)!==Ae(r))return!1;for(const s in n)if(n.hasOwnProperty(s)&&(void 0===r[s]||!We(n[s],r[s])))return!1;return!0}(t,e);default:return Gt()}}function Xe(t,e){return void 0!==(t.values||[]).find(t=>We(t,e))}function Ye(t,e){if(t===e)return 0;const n=Qe(t),r=Qe(e);if(n!==r)return ce(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return ce(t.booleanValue,e.booleanValue);case 2:return function(t,e){const n=Be(t.integerValue||t.doubleValue),r=Be(e.integerValue||e.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(t,e);case 3:return Je(t.timestampValue,e.timestampValue);case 4:return Je(ze(t),ze(e));case 5:return ce(t.stringValue,e.stringValue);case 6:return function(t,e){const n=je(t),r=je(e);return n.compareTo(r)}(t.bytesValue,e.bytesValue);case 7:return function(t,e){const n=t.split("/"),r=e.split("/");for(let s=0;s<n.length&&s<r.length;s++){const t=ce(n[s],r[s]);if(0!==t)return t}return ce(n.length,r.length)}(t.referenceValue,e.referenceValue);case 8:return function(t,e){const n=ce(Be(t.latitude),Be(e.latitude));return 0!==n?n:ce(Be(t.longitude),Be(e.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return function(t,e){const n=t.values||[],r=e.values||[];for(let s=0;s<n.length&&s<r.length;++s){const t=Ye(n[s],r[s]);if(t)return t}return ce(n.length,r.length)}(t.arrayValue,e.arrayValue);case 10:return function(t,e){if(t===He&&e===He)return 0;if(t===He)return 1;if(e===He)return-1;const n=t.fields||{},r=Object.keys(n),s=e.fields||{},i=Object.keys(s);r.sort(),i.sort();for(let o=0;o<r.length&&o<i.length;++o){const t=ce(r[o],i[o]);if(0!==t)return t;const e=Ye(n[r[o]],s[i[o]]);if(0!==e)return e}return ce(r.length,i.length)}(t.mapValue,e.mapValue);default:throw Gt()}}function Je(t,e){if("string"==typeof t&&"string"==typeof e&&t.length===e.length)return ce(t,e);const n=Ue(t),r=Ue(e),s=ce(n.seconds,r.seconds);return 0!==s?s:ce(n.nanos,r.nanos)}function Ze(t){return tn(t)}function tn(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(t){const e=Ue(t);return`time(${e.seconds},${e.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(t){return je(t).toBase64()}(t.bytesValue):"referenceValue"in t?function(t){return me.fromName(t).toString()}(t.referenceValue):"geoPointValue"in t?function(t){return`geo(${t.latitude},${t.longitude})`}(t.geoPointValue):"arrayValue"in t?function(t){let e="[",n=!0;for(const r of t.values||[])n?n=!1:e+=",",e+=tn(r);return e+"]"}(t.arrayValue):"mapValue"in t?function(t){const e=Object.keys(t.fields||{}).sort();let n="{",r=!0;for(const s of e)r?r=!1:n+=",",n+=`${s}:${tn(t.fields[s])}`;return n+"}"}(t.mapValue):Gt()}function en(t){return!!t&&"integerValue"in t}function nn(t){return!!t&&"arrayValue"in t}function rn(t){return!!t&&"nullValue"in t}function sn(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function on(t){return!!t&&"mapValue"in t}function an(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&"object"==typeof t.timestampValue)return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return De(t.mapValue.fields,(t,n)=>e.mapValue.fields[t]=an(n)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=an(t.arrayValue.values[n]);return e}return Object.assign({},t)}class cn{constructor(t){this.value=t}static empty(){return new cn({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let n=0;n<t.length-1;++n)if(e=(e.mapValue.fields||{})[t.get(n)],!on(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=an(e)}setAll(t){let e=ge.emptyPath(),n={},r=[];t.forEach((t,s)=>{if(!e.isImmediateParentOf(s)){const t=this.getFieldsMap(e);this.applyChanges(t,n,r),n={},r=[],e=s.popLast()}t?n[s.lastSegment()]=an(t):r.push(s.lastSegment())});const s=this.getFieldsMap(e);this.applyChanges(s,n,r)}delete(t){const e=this.field(t.popLast());on(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return We(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let n=0;n<t.length;++n){let r=e.mapValue.fields[t.get(n)];on(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},e.mapValue.fields[t.get(n)]=r),e=r}return e.mapValue.fields}applyChanges(t,e,n){De(e,(e,n)=>t[e]=n);for(const r of n)delete t[r]}clone(){return new cn(an(this.value))}}function hn(t){const e=[];return De(t.fields,(t,n)=>{const r=new ge([t]);if(on(n)){const t=hn(n.mapValue).fields;if(0===t.length)e.push(r);else for(const n of t)e.push(r.child(n))}else e.push(r)}),new Me(e)
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class un{constructor(t,e,n,r,s,i,o){this.key=t,this.documentType=e,this.version=n,this.readTime=r,this.createTime=s,this.data=i,this.documentState=o}static newInvalidDocument(t){return new un(t,0,le.min(),le.min(),le.min(),cn.empty(),0)}static newFoundDocument(t,e,n,r){return new un(t,1,e,le.min(),n,r,0)}static newNoDocument(t,e){return new un(t,2,e,le.min(),le.min(),cn.empty(),0)}static newUnknownDocument(t,e){return new un(t,3,e,le.min(),le.min(),cn.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(le.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=cn.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=cn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=le.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(t){return t instanceof un&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new un(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln{constructor(t,e){this.position=t,this.inclusive=e}}function dn(t,e,n){let r=0;for(let s=0;s<t.position.length;s++){const i=e[s],o=t.position[s];if(r=i.field.isKeyField()?me.comparator(me.fromName(o.referenceValue),n.key):Ye(o,n.data.field(i.field)),"desc"===i.dir&&(r*=-1),0!==r)break}return r}function fn(t,e){if(null===t)return null===e;if(null===e)return!1;if(t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!We(t.position[n],e.position[n]))return!1;return!0}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(t,e="asc"){this.field=t,this.dir=e}}function gn(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{}class yn extends mn{constructor(t,e,n){super(),this.field=t,this.op=e,this.value=n}static create(t,e,n){return t.isKeyField()?"in"===e||"not-in"===e?this.createKeyFieldInFilter(t,e,n):new Sn(t,e,n):"array-contains"===e?new Dn(t,n):"in"===e?new kn(t,n):"not-in"===e?new Nn(t,n):"array-contains-any"===e?new Rn(t,n):new yn(t,e,n)}static createKeyFieldInFilter(t,e,n){return"in"===e?new In(t,n):new Cn(t,n)}matches(t){const e=t.data.field(this.field);return"!="===this.op?null!==e&&this.matchesComparison(Ye(e,this.value)):null!==e&&Qe(this.value)===Qe(e)&&this.matchesComparison(Ye(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return 0===t;case"!=":return 0!==t;case">":return t>0;case">=":return t>=0;default:return Gt()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class vn extends mn{constructor(t,e){super(),this.filters=t,this.op=e,this.ae=null}static create(t,e){return new vn(t,e)}matches(t){return wn(this)?void 0===this.filters.find(e=>!e.matches(t)):void 0!==this.filters.find(e=>e.matches(t))}getFlattenedFilters(){return null!==this.ae||(this.ae=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function wn(t){return"and"===t.op}function _n(t){return function(t){for(const e of t.filters)if(e instanceof vn)return!1;return!0}(t)&&wn(t)}function En(t){if(t instanceof yn)return t.field.canonicalString()+t.op.toString()+Ze(t.value);if(_n(t))return t.filters.map(t=>En(t)).join(",");{const e=t.filters.map(t=>En(t)).join(",");return`${t.op}(${e})`}}function bn(t,e){return t instanceof yn?function(t,e){return e instanceof yn&&t.op===e.op&&t.field.isEqual(e.field)&&We(t.value,e.value)}(t,e):t instanceof vn?function(t,e){return e instanceof vn&&t.op===e.op&&t.filters.length===e.filters.length&&t.filters.reduce((t,n,r)=>t&&bn(n,e.filters[r]),!0)}(t,e):void Gt()}function Tn(t){return t instanceof yn?function(t){return`${t.field.canonicalString()} ${t.op} ${Ze(t.value)}`}(t):t instanceof vn?function(t){return t.op.toString()+" {"+t.getFilters().map(Tn).join(" ,")+"}"}(t):"Filter"}class Sn extends yn{constructor(t,e,n){super(t,e,n),this.key=me.fromName(n.referenceValue)}matches(t){const e=me.comparator(t.key,this.key);return this.matchesComparison(e)}}class In extends yn{constructor(t,e){super(t,"in",e),this.keys=An("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class Cn extends yn{constructor(t,e){super(t,"not-in",e),this.keys=An("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function An(t,e){var n;return((null===(n=e.arrayValue)||void 0===n?void 0:n.values)||[]).map(t=>me.fromName(t.referenceValue))}class Dn extends yn{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return nn(e)&&Xe(e.arrayValue,this.value)}}class kn extends yn{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return null!==e&&Xe(this.value.arrayValue,e)}}class Nn extends yn{constructor(t,e){super(t,"not-in",e)}matches(t){if(Xe(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return null!==e&&!Xe(this.value.arrayValue,e)}}class Rn extends yn{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!nn(e)||!e.arrayValue.values)&&e.arrayValue.values.some(t=>Xe(this.value.arrayValue,t))}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(t,e=null,n=[],r=[],s=null,i=null,o=null){this.path=t,this.collectionGroup=e,this.orderBy=n,this.filters=r,this.limit=s,this.startAt=i,this.endAt=o,this.ue=null}}function On(t,e=null,n=[],r=[],s=null,i=null,o=null){return new xn(t,e,n,r,s,i,o)}function Ln(t){const e=Qt(t);if(null===e.ue){let t=e.path.canonicalString();null!==e.collectionGroup&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(t=>En(t)).join(","),t+="|ob:",t+=e.orderBy.map(t=>function(t){return t.field.canonicalString()+t.dir}(t)).join(","),Ie(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(t=>Ze(t)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(t=>Ze(t)).join(",")),e.ue=t}return e.ue}function Mn(t,e){if(t.limit!==e.limit)return!1;if(t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!gn(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!bn(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!fn(t.startAt,e.startAt)&&fn(t.endAt,e.endAt)}function Pn(t){return me.isDocumentKey(t.path)&&null===t.collectionGroup&&0===t.filters.length}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(t,e=null,n=[],r=[],s=null,i="F",o=null,a=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=r,this.limit=s,this.limitType=i,this.startAt=o,this.endAt=a,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Vn(t){return new Fn(t)}function Un(t){return 0===t.filters.length&&null===t.limit&&null==t.startAt&&null==t.endAt&&(0===t.explicitOrderBy.length||1===t.explicitOrderBy.length&&t.explicitOrderBy[0].field.isKeyField())}function Bn(t){const e=Qt(t);if(null===e.ce){e.ce=[];const t=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),t.add(s.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc",r=function(t){let e=new Oe(ge.comparator);return t.filters.forEach(t=>{t.getFlattenedFilters().forEach(t=>{t.isInequality()&&(e=e.add(t.field))})}),e}(e);r.forEach(r=>{t.has(r.canonicalString())||r.isKeyField()||e.ce.push(new pn(r,n))}),t.has(ge.keyField().canonicalString())||e.ce.push(new pn(ge.keyField(),n))}return e.ce}function jn(t){const e=Qt(t);return e.le||(e.le=function(t,e){if("F"===t.limitType)return On(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(t=>{const e="desc"===t.dir?"asc":"desc";return new pn(t.field,e)});const n=t.endAt?new ln(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new ln(t.startAt.position,t.startAt.inclusive):null;return On(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}(e,Bn(t))),e.le}function qn(t,e,n){return new Fn(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function $n(t,e){return Mn(jn(t),jn(e))&&t.limitType===e.limitType}function zn(t){return`${Ln(jn(t))}|lt:${t.limitType}`}function Kn(t){return`Query(target=${function(t){let e=t.path.canonicalString();return null!==t.collectionGroup&&(e+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(e+=`, filters: [${t.filters.map(t=>Tn(t)).join(", ")}]`),Ie(t.limit)||(e+=", limit: "+t.limit),t.orderBy.length>0&&(e+=`, orderBy: [${t.orderBy.map(t=>function(t){return`${t.field.canonicalString()} (${t.dir})`}(t)).join(", ")}]`),t.startAt&&(e+=", startAt: ",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(t=>Ze(t)).join(",")),t.endAt&&(e+=", endAt: ",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(t=>Ze(t)).join(",")),`Target(${e})`}(jn(t))}; limitType=${t.limitType})`}function Gn(t,e){return e.isFoundDocument()&&function(t,e){const n=e.key.path;return null!==t.collectionGroup?e.key.hasCollectionId(t.collectionGroup)&&t.path.isPrefixOf(n):me.isDocumentKey(t.path)?t.path.isEqual(n):t.path.isImmediateParentOf(n)}(t,e)&&function(t,e){for(const n of Bn(t))if(!n.field.isKeyField()&&null===e.data.field(n.field))return!1;return!0}(t,e)&&function(t,e){for(const n of t.filters)if(!n.matches(e))return!1;return!0}(t,e)&&function(t,e){return!(t.startAt&&!function(t,e,n){const r=dn(t,e,n);return t.inclusive?r<=0:r<0}(t.startAt,Bn(t),e))&&!(t.endAt&&!function(t,e,n){const r=dn(t,e,n);return t.inclusive?r>=0:r>0}(t.endAt,Bn(t),e))}(t,e)}function Hn(t){return(e,n)=>{let r=!1;for(const s of Bn(t)){const t=Qn(s,e,n);if(0!==t)return t;r=r||s.field.isKeyField()}return 0}}function Qn(t,e,n){const r=t.field.isKeyField()?me.comparator(e.key,n.key):function(t,e,n){const r=e.data.field(t),s=n.data.field(t);return null!==r&&null!==s?Ye(r,s):Gt()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return Gt()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wn{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),n=this.inner[e];if(void 0!==n)for(const[r,s]of n)if(this.equalsFn(r,t))return s}has(t){return void 0!==this.get(t)}set(t,e){const n=this.mapKeyFn(t),r=this.inner[n];if(void 0===r)return this.inner[n]=[[t,e]],void this.innerSize++;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return void(r[s]=[t,e]);r.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),n=this.inner[e];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],t))return 1===n.length?delete this.inner[e]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(t){De(this.inner,(e,n)=>{for(const[r,s]of n)t(r,s)})}isEmpty(){return ke(this.inner)}size(){return this.innerSize}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xn=new Ne(me.comparator);function Yn(){return Xn}const Jn=new Ne(me.comparator);function Zn(...t){let e=Jn;for(const n of t)e=e.insert(n.key,n);return e}function tr(t){let e=Jn;return t.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function er(){return rr()}function nr(){return rr()}function rr(){return new Wn(t=>t.toString(),(t,e)=>t.isEqual(e))}const sr=new Ne(me.comparator),ir=new Oe(me.comparator);function or(...t){let e=ir;for(const n of t)e=e.add(n);return e}const ar=new Oe(ce);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function cr(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ce(e)?"-0":e}}function hr(t){return{integerValue:""+t}}function ur(t,e){return function(t){return"number"==typeof t&&Number.isInteger(t)&&!Ce(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}(e)?hr(e):cr(t,e)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(){this._=void 0}}function dr(t,e,n){return t instanceof gr?function(t,e){const n={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:t.seconds,nanos:t.nanoseconds}}}};return e&&qe(e)&&(e=$e(e)),e&&(n.fields.__previous_value__=e),{mapValue:n}}(n,e):t instanceof mr?yr(t,e):t instanceof vr?wr(t,e):function(t,e){const n=pr(t,e),r=Er(n)+Er(t.Pe);return en(n)&&en(t.Pe)?hr(r):cr(t.serializer,r)}(t,e)}function fr(t,e,n){return t instanceof mr?yr(t,e):t instanceof vr?wr(t,e):n}function pr(t,e){return t instanceof _r?function(t){return en(t)||function(t){return!!t&&"doubleValue"in t}(t)}(e)?e:{integerValue:0}:null}class gr extends lr{}class mr extends lr{constructor(t){super(),this.elements=t}}function yr(t,e){const n=br(e);for(const r of t.elements)n.some(t=>We(t,r))||n.push(r);return{arrayValue:{values:n}}}class vr extends lr{constructor(t){super(),this.elements=t}}function wr(t,e){let n=br(e);for(const r of t.elements)n=n.filter(t=>!We(t,r));return{arrayValue:{values:n}}}class _r extends lr{constructor(t,e){super(),this.serializer=t,this.Pe=e}}function Er(t){return Be(t.integerValue||t.doubleValue)}function br(t){return nn(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}class Tr{constructor(t,e){this.version=t,this.transformResults=e}}class Sr{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new Sr}static exists(t){return new Sr(void 0,t)}static updateTime(t){return new Sr(t)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Ir(t,e){return void 0!==t.updateTime?e.isFoundDocument()&&e.version.isEqual(t.updateTime):void 0===t.exists||t.exists===e.isFoundDocument()}class Cr{}function Ar(t,e){if(!t.hasLocalMutations||e&&0===e.fields.length)return null;if(null===e)return t.isNoDocument()?new Fr(t.key,Sr.none()):new xr(t.key,t.data,Sr.none());{const n=t.data,r=cn.empty();let s=new Oe(ge.comparator);for(let t of e.fields)if(!s.has(t)){let e=n.field(t);null===e&&t.length>1&&(t=t.popLast(),e=n.field(t)),null===e?r.delete(t):r.set(t,e),s=s.add(t)}return new Or(t.key,r,new Me(s.toArray()),Sr.none())}}function Dr(t,e,n){t instanceof xr?function(t,e,n){const r=t.value.clone(),s=Mr(t.fieldTransforms,e,n.transformResults);r.setAll(s),e.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(t,e,n):t instanceof Or?function(t,e,n){if(!Ir(t.precondition,e))return void e.convertToUnknownDocument(n.version);const r=Mr(t.fieldTransforms,e,n.transformResults),s=e.data;s.setAll(Lr(t)),s.setAll(r),e.convertToFoundDocument(n.version,s).setHasCommittedMutations()}(t,e,n):function(t,e,n){e.convertToNoDocument(n.version).setHasCommittedMutations()}(0,e,n)}function kr(t,e,n,r){return t instanceof xr?function(t,e,n,r){if(!Ir(t.precondition,e))return n;const s=t.value.clone(),i=Pr(t.fieldTransforms,r,e);return s.setAll(i),e.convertToFoundDocument(e.version,s).setHasLocalMutations(),null}(t,e,n,r):t instanceof Or?function(t,e,n,r){if(!Ir(t.precondition,e))return n;const s=Pr(t.fieldTransforms,r,e),i=e.data;return i.setAll(Lr(t)),i.setAll(s),e.convertToFoundDocument(e.version,i).setHasLocalMutations(),null===n?null:n.unionWith(t.fieldMask.fields).unionWith(t.fieldTransforms.map(t=>t.field))}(t,e,n,r):function(t,e,n){return Ir(t.precondition,e)?(e.convertToNoDocument(e.version).setHasLocalMutations(),null):n}(t,e,n)}function Nr(t,e){let n=null;for(const r of t.fieldTransforms){const t=e.data.field(r.field),s=pr(r.transform,t||null);null!=s&&(null===n&&(n=cn.empty()),n.set(r.field,s))}return n||null}function Rr(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(t,e){return void 0===t&&void 0===e||!(!t||!e)&&he(t,e,(t,e)=>function(t,e){return t.field.isEqual(e.field)&&function(t,e){return t instanceof mr&&e instanceof mr||t instanceof vr&&e instanceof vr?he(t.elements,e.elements,We):t instanceof _r&&e instanceof _r?We(t.Pe,e.Pe):t instanceof gr&&e instanceof gr}(t.transform,e.transform)}(t,e))}(t.fieldTransforms,e.fieldTransforms)&&(0===t.type?t.value.isEqual(e.value):1!==t.type||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class xr extends Cr{constructor(t,e,n,r=[]){super(),this.key=t,this.value=e,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Or extends Cr{constructor(t,e,n,r,s=[]){super(),this.key=t,this.data=e,this.fieldMask=n,this.precondition=r,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Lr(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function Mr(t,e,n){const r=new Map;Ht(t.length===n.length);for(let s=0;s<n.length;s++){const i=t[s],o=i.transform,a=e.data.field(i.field);r.set(i.field,fr(o,a,n[s]))}return r}function Pr(t,e,n){const r=new Map;for(const s of t){const t=s.transform,i=n.data.field(s.field);r.set(s.field,dr(t,i,e))}return r}class Fr extends Cr{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Vr extends Cr{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur{constructor(t,e,n,r){this.batchId=t,this.localWriteTime=e,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(t,e){const n=e.mutationResults;for(let r=0;r<this.mutations.length;r++){const e=this.mutations[r];e.key.isEqual(t.key)&&Dr(e,t,n[r])}}applyToLocalView(t,e){for(const n of this.baseMutations)n.key.isEqual(t.key)&&(e=kr(n,t,e,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(t.key)&&(e=kr(n,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const n=nr();return this.mutations.forEach(r=>{const s=t.get(r.key),i=s.overlayedDocument;let o=this.applyToLocalView(i,s.mutatedFields);o=e.has(r.key)?null:o;const a=Ar(i,o);null!==a&&n.set(r.key,a),i.isValidDocument()||i.convertToNoDocument(le.min())}),n}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),or())}isEqual(t){return this.batchId===t.batchId&&he(this.mutations,t.mutations,(t,e)=>Rr(t,e))&&he(this.baseMutations,t.baseMutations,(t,e)=>Rr(t,e))}}class Br{constructor(t,e,n,r){this.batch=t,this.commitVersion=e,this.mutationResults=n,this.docVersions=r}static from(t,e,n){Ht(t.mutations.length===n.length);let r=sr;const s=t.mutations;for(let i=0;i<s.length;i++)r=r.insert(s[i].key,n[i].version);return new Br(t,e,n,r)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return null!==t&&this.mutation===t.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(t,e){this.count=t,this.unchangedNames=e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $r,zr;function Kr(t){if(void 0===t)return $t("GRPC error has no .code"),Wt.UNKNOWN;switch(t){case $r.OK:return Wt.OK;case $r.CANCELLED:return Wt.CANCELLED;case $r.UNKNOWN:return Wt.UNKNOWN;case $r.DEADLINE_EXCEEDED:return Wt.DEADLINE_EXCEEDED;case $r.RESOURCE_EXHAUSTED:return Wt.RESOURCE_EXHAUSTED;case $r.INTERNAL:return Wt.INTERNAL;case $r.UNAVAILABLE:return Wt.UNAVAILABLE;case $r.UNAUTHENTICATED:return Wt.UNAUTHENTICATED;case $r.INVALID_ARGUMENT:return Wt.INVALID_ARGUMENT;case $r.NOT_FOUND:return Wt.NOT_FOUND;case $r.ALREADY_EXISTS:return Wt.ALREADY_EXISTS;case $r.PERMISSION_DENIED:return Wt.PERMISSION_DENIED;case $r.FAILED_PRECONDITION:return Wt.FAILED_PRECONDITION;case $r.ABORTED:return Wt.ABORTED;case $r.OUT_OF_RANGE:return Wt.OUT_OF_RANGE;case $r.UNIMPLEMENTED:return Wt.UNIMPLEMENTED;case $r.DATA_LOSS:return Wt.DATA_LOSS;default:return Gt()}}(zr=$r||($r={}))[zr.OK=0]="OK",zr[zr.CANCELLED=1]="CANCELLED",zr[zr.UNKNOWN=2]="UNKNOWN",zr[zr.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",zr[zr.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",zr[zr.NOT_FOUND=5]="NOT_FOUND",zr[zr.ALREADY_EXISTS=6]="ALREADY_EXISTS",zr[zr.PERMISSION_DENIED=7]="PERMISSION_DENIED",zr[zr.UNAUTHENTICATED=16]="UNAUTHENTICATED",zr[zr.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",zr[zr.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",zr[zr.ABORTED=10]="ABORTED",zr[zr.OUT_OF_RANGE=11]="OUT_OF_RANGE",zr[zr.UNIMPLEMENTED=12]="UNIMPLEMENTED",zr[zr.INTERNAL=13]="INTERNAL",zr[zr.UNAVAILABLE=14]="UNAVAILABLE",zr[zr.DATA_LOSS=15]="DATA_LOSS";
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Gr=new St([4294967295,4294967295],0);function Hr(t){const e=(new TextEncoder).encode(t),n=new It;return n.update(e),new Uint8Array(n.digest())}function Qr(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new St([n,r],0),new St([s,i],0)]}class Wr{constructor(t,e,n){if(this.bitmap=t,this.padding=e,this.hashCount=n,e<0||e>=8)throw new Xr(`Invalid padding: ${e}`);if(n<0)throw new Xr(`Invalid hash count: ${n}`);if(t.length>0&&0===this.hashCount)throw new Xr(`Invalid hash count: ${n}`);if(0===t.length&&0!==e)throw new Xr(`Invalid padding when bitmap length is 0: ${e}`);this.Ie=8*t.length-e,this.Te=St.fromNumber(this.Ie)}Ee(t,e,n){let r=t.add(e.multiply(St.fromNumber(n)));return 1===r.compare(Gr)&&(r=new St([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(0===this.Ie)return!1;const e=Hr(t),[n,r]=Qr(e);for(let s=0;s<this.hashCount;s++){const t=this.Ee(n,r,s);if(!this.de(t))return!1}return!0}static create(t,e,n){const r=t%8==0?0:8-t%8,s=new Uint8Array(Math.ceil(t/8)),i=new Wr(s,r,e);return n.forEach(t=>i.insert(t)),i}insert(t){if(0===this.Ie)return;const e=Hr(t),[n,r]=Qr(e);for(let s=0;s<this.hashCount;s++){const t=this.Ee(n,r,s);this.Ae(t)}}Ae(t){const e=Math.floor(t/8),n=t%8;this.bitmap[e]|=1<<n}}class Xr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(t,e,n,r,s){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(t,e,n){const r=new Map;return r.set(t,Jr.createSynthesizedTargetChangeForCurrentChange(t,e,n)),new Yr(le.min(),r,new Ne(ce),Yn(),or())}}class Jr{constructor(t,e,n,r,s){this.resumeToken=t,this.current=e,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(t,e,n){return new Jr(n,e,or(),or(),or())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zr{constructor(t,e,n,r){this.Re=t,this.removedTargetIds=e,this.key=n,this.Ve=r}}class ts{constructor(t,e){this.targetId=t,this.me=e}}class es{constructor(t,e,n=Fe.EMPTY_BYTE_STRING,r=null){this.state=t,this.targetIds=e,this.resumeToken=n,this.cause=r}}class ns{constructor(){this.fe=0,this.ge=is(),this.pe=Fe.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return 0!==this.fe}get be(){return this.we}De(t){t.approximateByteSize()>0&&(this.we=!0,this.pe=t)}Ce(){let t=or(),e=or(),n=or();return this.ge.forEach((r,s)=>{switch(s){case 0:t=t.add(r);break;case 2:e=e.add(r);break;case 1:n=n.add(r);break;default:Gt()}}),new Jr(this.pe,this.ye,t,e,n)}ve(){this.we=!1,this.ge=is()}Fe(t,e){this.we=!0,this.ge=this.ge.insert(t,e)}Me(t){this.we=!0,this.ge=this.ge.remove(t)}xe(){this.fe+=1}Oe(){this.fe-=1,Ht(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class rs{constructor(t){this.Le=t,this.Be=new Map,this.ke=Yn(),this.qe=ss(),this.Qe=new Ne(ce)}Ke(t){for(const e of t.Re)t.Ve&&t.Ve.isFoundDocument()?this.$e(e,t.Ve):this.Ue(e,t.key,t.Ve);for(const e of t.removedTargetIds)this.Ue(e,t.key,t.Ve)}We(t){this.forEachTarget(t,e=>{const n=this.Ge(e);switch(t.state){case 0:this.ze(e)&&n.De(t.resumeToken);break;case 1:n.Oe(),n.Se||n.ve(),n.De(t.resumeToken);break;case 2:n.Oe(),n.Se||this.removeTarget(e);break;case 3:this.ze(e)&&(n.Ne(),n.De(t.resumeToken));break;case 4:this.ze(e)&&(this.je(e),n.De(t.resumeToken));break;default:Gt()}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.Be.forEach((t,n)=>{this.ze(n)&&e(n)})}He(t){const e=t.targetId,n=t.me.count,r=this.Je(e);if(r){const s=r.target;if(Pn(s))if(0===n){const t=new me(s.path);this.Ue(e,t,un.newNoDocument(t,le.min()))}else Ht(1===n);else{const r=this.Ye(e);if(r!==n){const n=this.Ze(t),s=n?this.Xe(n,t,r):1;if(0!==s){this.je(e);const t=2===s?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(e,t)}}}}}Ze(t){const e=t.me.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:s=0}=e;let i,o;try{i=je(n).toUint8Array()}catch(t){if(t instanceof Pe)return zt("Decoding the base64 bloom filter in existence filter failed ("+t.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw t}try{o=new Wr(i,r,s)}catch(t){return zt(t instanceof Xr?"BloomFilter error: ":"Applying bloom filter failed: ",t),null}return 0===o.Ie?null:o}Xe(t,e,n){return e.me.count===n-this.nt(t,e.targetId)?0:2}nt(t,e){const n=this.Le.getRemoteKeysForTarget(e);let r=0;return n.forEach(n=>{const s=this.Le.tt(),i=`projects/${s.projectId}/databases/${s.database}/documents/${n.path.canonicalString()}`;t.mightContain(i)||(this.Ue(e,n,null),r++)}),r}rt(t){const e=new Map;this.Be.forEach((n,r)=>{const s=this.Je(r);if(s){if(n.current&&Pn(s.target)){const e=new me(s.target.path);null!==this.ke.get(e)||this.it(r,e)||this.Ue(r,e,un.newNoDocument(e,t))}n.be&&(e.set(r,n.Ce()),n.ve())}});let n=or();this.qe.forEach((t,e)=>{let r=!0;e.forEachWhile(t=>{const e=this.Je(t);return!e||"TargetPurposeLimboResolution"===e.purpose||(r=!1,!1)}),r&&(n=n.add(t))}),this.ke.forEach((e,n)=>n.setReadTime(t));const r=new Yr(t,e,this.Qe,this.ke,n);return this.ke=Yn(),this.qe=ss(),this.Qe=new Ne(ce),r}$e(t,e){if(!this.ze(t))return;const n=this.it(t,e.key)?2:0;this.Ge(t).Fe(e.key,n),this.ke=this.ke.insert(e.key,e),this.qe=this.qe.insert(e.key,this.st(e.key).add(t))}Ue(t,e,n){if(!this.ze(t))return;const r=this.Ge(t);this.it(t,e)?r.Fe(e,1):r.Me(e),this.qe=this.qe.insert(e,this.st(e).delete(t)),n&&(this.ke=this.ke.insert(e,n))}removeTarget(t){this.Be.delete(t)}Ye(t){const e=this.Ge(t).Ce();return this.Le.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}xe(t){this.Ge(t).xe()}Ge(t){let e=this.Be.get(t);return e||(e=new ns,this.Be.set(t,e)),e}st(t){let e=this.qe.get(t);return e||(e=new Oe(ce),this.qe=this.qe.insert(t,e)),e}ze(t){const e=null!==this.Je(t);return e||qt("WatchChangeAggregator","Detected inactive target",t),e}Je(t){const e=this.Be.get(t);return e&&e.Se?null:this.Le.ot(t)}je(t){this.Be.set(t,new ns),this.Le.getRemoteKeysForTarget(t).forEach(e=>{this.Ue(t,e,null)})}it(t,e){return this.Le.getRemoteKeysForTarget(t).has(e)}}function ss(){return new Ne(me.comparator)}function is(){return new Ne(me.comparator)}const os={asc:"ASCENDING",desc:"DESCENDING"},as={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},cs={and:"AND",or:"OR"};class hs{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function us(t,e){return t.useProto3Json||Ie(e)?e:{value:e}}function ls(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ds(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function fs(t,e){return ls(t,e.toTimestamp())}function ps(t){return Ht(!!t),le.fromTimestamp(function(t){const e=Ue(t);return new ue(e.seconds,e.nanos)}(t))}function gs(t,e){return ms(t,e).canonicalString()}function ms(t,e){const n=function(t){return new fe(["projects",t.projectId,"databases",t.database])}(t).child("documents");return void 0===e?n:n.child(e)}function ys(t){const e=fe.fromString(t);return Ht(Ms(e)),e}function vs(t,e){return gs(t.databaseId,e.path)}function ws(t,e){const n=ys(e);if(n.get(1)!==t.databaseId.projectId)throw new Xt(Wt.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new Xt(Wt.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new me(bs(n))}function _s(t,e){return gs(t.databaseId,e)}function Es(t){return new fe(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function bs(t){return Ht(t.length>4&&"documents"===t.get(4)),t.popFirst(5)}function Ts(t,e,n){return{name:vs(t,e),fields:n.value.mapValue.fields}}function Ss(t,e){return{documents:[_s(t,e.path)]}}function Is(t,e){const n={structuredQuery:{}},r=e.path;let s;null!==e.collectionGroup?(s=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=_s(t,s);const i=function(t){if(0!==t.length)return Os(vn.create(t,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(t){if(0!==t.length)return t.map(t=>function(t){return{field:Rs(t.field),direction:Ds(t.dir)}}(t))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const a=us(t,e.limit);return null!==a&&(n.structuredQuery.limit=a),e.startAt&&(n.structuredQuery.startAt=function(t){return{before:t.inclusive,values:t.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(t){return{before:!t.inclusive,values:t.position}}(e.endAt)),{_t:n,parent:s}}function Cs(t){let e=function(t){const e=ys(t);return 4===e.length?fe.emptyPath():bs(e)}(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let s=null;if(r>0){Ht(1===r);const t=n.from[0];t.allDescendants?s=t.collectionId:e=e.child(t.collectionId)}let i=[];n.where&&(i=function(t){const e=As(t);return e instanceof vn&&_n(e)?e.getFilters():[e]}(n.where));let o=[];n.orderBy&&(o=function(t){return t.map(t=>function(t){return new pn(xs(t.field),function(t){switch(t){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(t.direction))}(t))}(n.orderBy));let a=null;n.limit&&(a=function(t){let e;return e="object"==typeof t?t.value:t,Ie(e)?null:e}(n.limit));let c=null;n.startAt&&(c=function(t){const e=!!t.before,n=t.values||[];return new ln(n,e)}(n.startAt));let h=null;return n.endAt&&(h=function(t){const e=!t.before,n=t.values||[];return new ln(n,e)}(n.endAt)),function(t,e,n,r,s,i,o,a){return new Fn(t,e,n,r,s,i,o,a)}(e,s,o,i,a,"F",c,h)}function As(t){return void 0!==t.unaryFilter?function(t){switch(t.unaryFilter.op){case"IS_NAN":const e=xs(t.unaryFilter.field);return yn.create(e,"==",{doubleValue:NaN});case"IS_NULL":const n=xs(t.unaryFilter.field);return yn.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=xs(t.unaryFilter.field);return yn.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const s=xs(t.unaryFilter.field);return yn.create(s,"!=",{nullValue:"NULL_VALUE"});default:return Gt()}}(t):void 0!==t.fieldFilter?function(t){return yn.create(xs(t.fieldFilter.field),function(t){switch(t){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Gt()}}(t.fieldFilter.op),t.fieldFilter.value)}(t):void 0!==t.compositeFilter?function(t){return vn.create(t.compositeFilter.filters.map(t=>As(t)),function(t){switch(t){case"AND":return"and";case"OR":return"or";default:return Gt()}}(t.compositeFilter.op))}(t):Gt()}function Ds(t){return os[t]}function ks(t){return as[t]}function Ns(t){return cs[t]}function Rs(t){return{fieldPath:t.canonicalString()}}function xs(t){return ge.fromServerFormat(t.fieldPath)}function Os(t){return t instanceof yn?function(t){if("=="===t.op){if(sn(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NAN"}};if(rn(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NULL"}}}else if("!="===t.op){if(sn(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NOT_NAN"}};if(rn(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Rs(t.field),op:ks(t.op),value:t.value}}}(t):t instanceof vn?function(t){const e=t.getFilters().map(t=>Os(t));return 1===e.length?e[0]:{compositeFilter:{op:Ns(t.op),filters:e}}}(t):Gt()}function Ls(t){const e=[];return t.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Ms(t){return t.length>=4&&"projects"===t.get(0)&&"databases"===t.get(2)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ps{constructor(t,e,n,r,s=le.min(),i=le.min(),o=Fe.EMPTY_BYTE_STRING,a=null){this.target=t,this.targetId=e,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=i,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(t){return new Ps(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new Ps(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new Ps(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new Ps(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(t){this.ct=t}}function Vs(t){const e=Cs({parent:t.parent,structuredQuery:t.structuredQuery});return"LAST"===t.limitType?qn(e,e.limit,"L"):e}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Us{constructor(){this._n=new Bs}addToCollectionParentIndex(t,e){return this._n.add(e),be.resolve()}getCollectionParents(t,e){return be.resolve(this._n.getEntries(e))}addFieldIndex(t,e){return be.resolve()}deleteFieldIndex(t,e){return be.resolve()}deleteAllFieldIndexes(t){return be.resolve()}createTargetIndexes(t,e){return be.resolve()}getDocumentsMatchingTarget(t,e){return be.resolve(null)}getIndexType(t,e){return be.resolve(0)}getFieldIndexes(t,e){return be.resolve([])}getNextCollectionGroupToUpdate(t){return be.resolve(null)}getMinOffset(t,e){return be.resolve(ve.min())}getMinOffsetFromCollectionGroup(t,e){return be.resolve(ve.min())}updateCollectionGroup(t,e,n){return be.resolve()}updateIndexEntries(t,e){return be.resolve()}}class Bs{constructor(){this.index={}}add(t){const e=t.lastSegment(),n=t.popLast(),r=this.index[e]||new Oe(fe.comparator),s=!r.has(n);return this.index[e]=r.add(n),s}has(t){const e=t.lastSegment(),n=t.popLast(),r=this.index[e];return r&&r.has(n)}getEntries(t){return(this.index[t]||new Oe(fe.comparator)).toArray()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class js{constructor(t){this.On=t}next(){return this.On+=2,this.On}static Nn(){return new js(0)}static Ln(){return new js(-1)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(){this.changes=new Wn(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,un.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const n=this.changes.get(e);return void 0!==n?be.resolve(n):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(t,e,n,r){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=n,this.indexManager=r}getDocument(t,e){let n=null;return this.documentOverlayCache.getOverlay(t,e).next(r=>(n=r,this.remoteDocumentCache.getEntry(t,e))).next(t=>(null!==n&&kr(n.mutation,t,Me.empty(),ue.now()),t))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(e=>this.getLocalViewOfDocuments(t,e,or()).next(()=>e))}getLocalViewOfDocuments(t,e,n=or()){const r=er();return this.populateOverlays(t,r,e).next(()=>this.computeViews(t,e,r,n).next(t=>{let e=Zn();return t.forEach((t,n)=>{e=e.insert(t,n.overlayedDocument)}),e}))}getOverlayedDocuments(t,e){const n=er();return this.populateOverlays(t,n,e).next(()=>this.computeViews(t,e,n,or()))}populateOverlays(t,e,n){const r=[];return n.forEach(t=>{e.has(t)||r.push(t)}),this.documentOverlayCache.getOverlays(t,r).next(t=>{t.forEach((t,n)=>{e.set(t,n)})})}computeViews(t,e,n,r){let s=Yn();const i=rr(),o=rr();return e.forEach((t,e)=>{const o=n.get(e.key);r.has(e.key)&&(void 0===o||o.mutation instanceof Or)?s=s.insert(e.key,e):void 0!==o?(i.set(e.key,o.mutation.getFieldMask()),kr(o.mutation,e,o.mutation.getFieldMask(),ue.now())):i.set(e.key,Me.empty())}),this.recalculateAndSaveOverlays(t,s).next(t=>(t.forEach((t,e)=>i.set(t,e)),e.forEach((t,e)=>{var n;return o.set(t,new $s(e,null!==(n=i.get(t))&&void 0!==n?n:null))}),o))}recalculateAndSaveOverlays(t,e){const n=rr();let r=new Ne((t,e)=>t-e),s=or();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(t=>{for(const s of t)s.keys().forEach(t=>{const i=e.get(t);if(null===i)return;let o=n.get(t)||Me.empty();o=s.applyToLocalView(i,o),n.set(t,o);const a=(r.get(s.batchId)||or()).add(t);r=r.insert(s.batchId,a)})}).next(()=>{const i=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,c=r.value,h=nr();c.forEach(t=>{if(!s.has(t)){const r=Ar(e.get(t),n.get(t));null!==r&&h.set(t,r),s=s.add(t)}}),i.push(this.documentOverlayCache.saveOverlays(t,a,h))}return be.waitFor(i)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(e=>this.recalculateAndSaveOverlays(t,e))}getDocumentsMatchingQuery(t,e,n,r){return function(t){return me.isDocumentKey(t.path)&&null===t.collectionGroup&&0===t.filters.length}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):function(t){return null!==t.collectionGroup}(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,n,r):this.getDocumentsMatchingCollectionQuery(t,e,n,r)}getNextDocuments(t,e,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,n,r).next(s=>{const i=r-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,n.largestBatchId,r-s.size):be.resolve(er());let o=-1,a=s;return i.next(e=>be.forEach(e,(e,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),s.get(e)?be.resolve():this.remoteDocumentCache.getEntry(t,e).next(t=>{a=a.insert(e,t)}))).next(()=>this.populateOverlays(t,e,s)).next(()=>this.computeViews(t,a,e,or())).next(t=>({batchId:o,changes:tr(t)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new me(e)).next(t=>{let e=Zn();return t.isFoundDocument()&&(e=e.insert(t.key,t)),e})}getDocumentsMatchingCollectionGroupQuery(t,e,n,r){const s=e.collectionGroup;let i=Zn();return this.indexManager.getCollectionParents(t,s).next(o=>be.forEach(o,o=>{const a=function(t,e){return new Fn(e,null,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,t.startAt,t.endAt)}(e,o.child(s));return this.getDocumentsMatchingCollectionQuery(t,a,n,r).next(t=>{t.forEach((t,e)=>{i=i.insert(t,e)})})}).next(()=>i))}getDocumentsMatchingCollectionQuery(t,e,n,r){let s;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,n.largestBatchId).next(i=>(s=i,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,n,s,r))).next(t=>{s.forEach((e,n)=>{const r=n.getKey();null===t.get(r)&&(t=t.insert(r,un.newInvalidDocument(r)))});let n=Zn();return t.forEach((t,r)=>{const i=s.get(t);void 0!==i&&kr(i.mutation,r,Me.empty(),ue.now()),Gn(e,r)&&(n=n.insert(t,r))}),n})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(t){this.serializer=t,this.cr=new Map,this.lr=new Map}getBundleMetadata(t,e){return be.resolve(this.cr.get(e))}saveBundleMetadata(t,e){return this.cr.set(e.id,function(t){return{id:t.id,version:t.version,createTime:ps(t.createTime)}}(e)),be.resolve()}getNamedQuery(t,e){return be.resolve(this.lr.get(e))}saveNamedQuery(t,e){return this.lr.set(e.name,function(t){return{name:t.name,query:Vs(t.bundledQuery),readTime:ps(t.readTime)}}(e)),be.resolve()}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gs{constructor(){this.overlays=new Ne(me.comparator),this.hr=new Map}getOverlay(t,e){return be.resolve(this.overlays.get(e))}getOverlays(t,e){const n=er();return be.forEach(e,e=>this.getOverlay(t,e).next(t=>{null!==t&&n.set(e,t)})).next(()=>n)}saveOverlays(t,e,n){return n.forEach((n,r)=>{this.ht(t,e,r)}),be.resolve()}removeOverlaysForBatchId(t,e,n){const r=this.hr.get(n);return void 0!==r&&(r.forEach(t=>this.overlays=this.overlays.remove(t)),this.hr.delete(n)),be.resolve()}getOverlaysForCollection(t,e,n){const r=er(),s=e.length+1,i=new me(e.child("")),o=this.overlays.getIteratorFrom(i);for(;o.hasNext();){const t=o.getNext().value,i=t.getKey();if(!e.isPrefixOf(i.path))break;i.path.length===s&&t.largestBatchId>n&&r.set(t.getKey(),t)}return be.resolve(r)}getOverlaysForCollectionGroup(t,e,n,r){let s=new Ne((t,e)=>t-e);const i=this.overlays.getIterator();for(;i.hasNext();){const t=i.getNext().value;if(t.getKey().getCollectionGroup()===e&&t.largestBatchId>n){let e=s.get(t.largestBatchId);null===e&&(e=er(),s=s.insert(t.largestBatchId,e)),e.set(t.getKey(),t)}}const o=er(),a=s.getIterator();for(;a.hasNext()&&(a.getNext().value.forEach((t,e)=>o.set(t,e)),!(o.size()>=r)););return be.resolve(o)}ht(t,e,n){const r=this.overlays.get(n.key);if(null!==r){const t=this.hr.get(r.largestBatchId).delete(n.key);this.hr.set(r.largestBatchId,t)}this.overlays=this.overlays.insert(n.key,new jr(e,n));let s=this.hr.get(e);void 0===s&&(s=or(),this.hr.set(e,s)),this.hr.set(e,s.add(n.key))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hs{constructor(){this.Pr=new Oe(Qs.Ir),this.Tr=new Oe(Qs.Er)}isEmpty(){return this.Pr.isEmpty()}addReference(t,e){const n=new Qs(t,e);this.Pr=this.Pr.add(n),this.Tr=this.Tr.add(n)}dr(t,e){t.forEach(t=>this.addReference(t,e))}removeReference(t,e){this.Ar(new Qs(t,e))}Rr(t,e){t.forEach(t=>this.removeReference(t,e))}Vr(t){const e=new me(new fe([])),n=new Qs(e,t),r=new Qs(e,t+1),s=[];return this.Tr.forEachInRange([n,r],t=>{this.Ar(t),s.push(t.key)}),s}mr(){this.Pr.forEach(t=>this.Ar(t))}Ar(t){this.Pr=this.Pr.delete(t),this.Tr=this.Tr.delete(t)}gr(t){const e=new me(new fe([])),n=new Qs(e,t),r=new Qs(e,t+1);let s=or();return this.Tr.forEachInRange([n,r],t=>{s=s.add(t.key)}),s}containsKey(t){const e=new Qs(t,0),n=this.Pr.firstAfterOrEqual(e);return null!==n&&t.isEqual(n.key)}}class Qs{constructor(t,e){this.key=t,this.pr=e}static Ir(t,e){return me.comparator(t.key,e.key)||ce(t.pr,e.pr)}static Er(t,e){return ce(t.pr,e.pr)||me.comparator(t.key,e.key)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ws{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.yr=1,this.wr=new Oe(Qs.Ir)}checkEmpty(t){return be.resolve(0===this.mutationQueue.length)}addMutationBatch(t,e,n,r){const s=this.yr;this.yr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const i=new Ur(s,e,n,r);this.mutationQueue.push(i);for(const o of r)this.wr=this.wr.add(new Qs(o.key,s)),this.indexManager.addToCollectionParentIndex(t,o.key.path.popLast());return be.resolve(i)}lookupMutationBatch(t,e){return be.resolve(this.Sr(e))}getNextMutationBatchAfterBatchId(t,e){const n=e+1,r=this.br(n),s=r<0?0:r;return be.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return be.resolve(0===this.mutationQueue.length?-1:this.yr-1)}getAllMutationBatches(t){return be.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const n=new Qs(e,0),r=new Qs(e,Number.POSITIVE_INFINITY),s=[];return this.wr.forEachInRange([n,r],t=>{const e=this.Sr(t.pr);s.push(e)}),be.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new Oe(ce);return e.forEach(t=>{const e=new Qs(t,0),r=new Qs(t,Number.POSITIVE_INFINITY);this.wr.forEachInRange([e,r],t=>{n=n.add(t.pr)})}),be.resolve(this.Dr(n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,r=n.length+1;let s=n;me.isDocumentKey(s)||(s=s.child(""));const i=new Qs(new me(s),0);let o=new Oe(ce);return this.wr.forEachWhile(t=>{const e=t.key.path;return!!n.isPrefixOf(e)&&(e.length===r&&(o=o.add(t.pr)),!0)},i),be.resolve(this.Dr(o))}Dr(t){const e=[];return t.forEach(t=>{const n=this.Sr(t);null!==n&&e.push(n)}),e}removeMutationBatch(t,e){Ht(0===this.Cr(e.batchId,"removed")),this.mutationQueue.shift();let n=this.wr;return be.forEach(e.mutations,r=>{const s=new Qs(r.key,e.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(t,r.key)}).next(()=>{this.wr=n})}Mn(t){}containsKey(t,e){const n=new Qs(e,0),r=this.wr.firstAfterOrEqual(n);return be.resolve(e.isEqual(r&&r.key))}performConsistencyCheck(t){return this.mutationQueue.length,be.resolve()}Cr(t,e){return this.br(t)}br(t){return 0===this.mutationQueue.length?0:t-this.mutationQueue[0].batchId}Sr(t){const e=this.br(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xs{constructor(t){this.vr=t,this.docs=new Ne(me.comparator),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const n=e.key,r=this.docs.get(n),s=r?r.size:0,i=this.vr(e);return this.docs=this.docs.insert(n,{document:e.mutableCopy(),size:i}),this.size+=i-s,this.indexManager.addToCollectionParentIndex(t,n.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const n=this.docs.get(e);return be.resolve(n?n.document.mutableCopy():un.newInvalidDocument(e))}getEntries(t,e){let n=Yn();return e.forEach(t=>{const e=this.docs.get(t);n=n.insert(t,e?e.document.mutableCopy():un.newInvalidDocument(t))}),be.resolve(n)}getDocumentsMatchingQuery(t,e,n,r){let s=Yn();const i=e.path,o=new me(i.child("")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:t,value:{document:o}}=a.getNext();if(!i.isPrefixOf(t.path))break;t.path.length>i.length+1||we(ye(o),n)<=0||(r.has(o.key)||Gn(e,o))&&(s=s.insert(o.key,o.mutableCopy()))}return be.resolve(s)}getAllFromCollectionGroup(t,e,n,r){Gt()}Fr(t,e){return be.forEach(this.docs,t=>e(t))}newChangeBuffer(t){return new Ys(this)}getSize(t){return be.resolve(this.size)}}class Ys extends qs{constructor(t){super(),this.ar=t}applyChanges(t){const e=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?e.push(this.ar.addEntry(t,r)):this.ar.removeEntry(n)}),be.waitFor(e)}getFromCache(t,e){return this.ar.getEntry(t,e)}getAllFromCache(t,e){return this.ar.getEntries(t,e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Js{constructor(t){this.persistence=t,this.Mr=new Wn(t=>Ln(t),Mn),this.lastRemoteSnapshotVersion=le.min(),this.highestTargetId=0,this.Or=0,this.Nr=new Hs,this.targetCount=0,this.Lr=js.Nn()}forEachTarget(t,e){return this.Mr.forEach((t,n)=>e(n)),be.resolve()}getLastRemoteSnapshotVersion(t){return be.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return be.resolve(this.Or)}allocateTargetId(t){return this.highestTargetId=this.Lr.next(),be.resolve(this.highestTargetId)}setTargetsMetadata(t,e,n){return n&&(this.lastRemoteSnapshotVersion=n),e>this.Or&&(this.Or=e),be.resolve()}qn(t){this.Mr.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.Lr=new js(e),this.highestTargetId=e),t.sequenceNumber>this.Or&&(this.Or=t.sequenceNumber)}addTargetData(t,e){return this.qn(e),this.targetCount+=1,be.resolve()}updateTargetData(t,e){return this.qn(e),be.resolve()}removeTargetData(t,e){return this.Mr.delete(e.target),this.Nr.Vr(e.targetId),this.targetCount-=1,be.resolve()}removeTargets(t,e,n){let r=0;const s=[];return this.Mr.forEach((i,o)=>{o.sequenceNumber<=e&&null===n.get(o.targetId)&&(this.Mr.delete(i),s.push(this.removeMatchingKeysForTargetId(t,o.targetId)),r++)}),be.waitFor(s).next(()=>r)}getTargetCount(t){return be.resolve(this.targetCount)}getTargetData(t,e){const n=this.Mr.get(e)||null;return be.resolve(n)}addMatchingKeys(t,e,n){return this.Nr.dr(e,n),be.resolve()}removeMatchingKeys(t,e,n){this.Nr.Rr(e,n);const r=this.persistence.referenceDelegate,s=[];return r&&e.forEach(e=>{s.push(r.markPotentiallyOrphaned(t,e))}),be.waitFor(s)}removeMatchingKeysForTargetId(t,e){return this.Nr.Vr(e),be.resolve()}getMatchingKeysForTargetId(t,e){const n=this.Nr.gr(e);return be.resolve(n)}containsKey(t,e){return be.resolve(this.Nr.containsKey(e))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zs{constructor(t,e){this.Br={},this.overlays={},this.kr=new Se(0),this.qr=!1,this.qr=!0,this.referenceDelegate=t(this),this.Qr=new Js(this),this.indexManager=new Us,this.remoteDocumentCache=function(t){return new Xs(t)}(t=>this.referenceDelegate.Kr(t)),this.serializer=new Fs(e),this.$r=new Ks(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.qr=!1,Promise.resolve()}get started(){return this.qr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Gs,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let n=this.Br[t.toKey()];return n||(n=new Ws(e,this.referenceDelegate),this.Br[t.toKey()]=n),n}getTargetCache(){return this.Qr}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.$r}runTransaction(t,e,n){qt("MemoryPersistence","Starting transaction:",t);const r=new ti(this.kr.next());return this.referenceDelegate.Ur(),n(r).next(t=>this.referenceDelegate.Wr(r).next(()=>t)).toPromise().then(t=>(r.raiseOnCommittedEvent(),t))}Gr(t,e){return be.or(Object.values(this.Br).map(n=>()=>n.containsKey(t,e)))}}class ti extends _e{constructor(t){super(),this.currentSequenceNumber=t}}class ei{constructor(t){this.persistence=t,this.zr=new Hs,this.jr=null}static Hr(t){return new ei(t)}get Jr(){if(this.jr)return this.jr;throw Gt()}addReference(t,e,n){return this.zr.addReference(n,e),this.Jr.delete(n.toString()),be.resolve()}removeReference(t,e,n){return this.zr.removeReference(n,e),this.Jr.add(n.toString()),be.resolve()}markPotentiallyOrphaned(t,e){return this.Jr.add(e.toString()),be.resolve()}removeTarget(t,e){this.zr.Vr(e.targetId).forEach(t=>this.Jr.add(t.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(t,e.targetId).next(t=>{t.forEach(t=>this.Jr.add(t.toString()))}).next(()=>n.removeTargetData(t,e))}Ur(){this.jr=new Set}Wr(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return be.forEach(this.Jr,n=>{const r=me.fromPath(n);return this.Yr(t,r).next(t=>{t||e.removeEntry(r,le.min())})}).next(()=>(this.jr=null,e.apply(t)))}updateLimboDocument(t,e){return this.Yr(t,e).next(t=>{t?this.Jr.delete(e.toString()):this.Jr.add(e.toString())})}Kr(t){return 0}Yr(t,e){return be.or([()=>be.resolve(this.zr.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Gr(t,e)])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ni{constructor(t,e,n,r){this.targetId=t,this.fromCache=e,this.qi=n,this.Qi=r}static Ki(t,e){let n=or(),r=or();for(const s of e.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:r=r.add(s.doc.key)}return new ni(t,e.fromCache,n,r)}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ri{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(){this.$i=!1,this.Ui=!1,this.Wi=100,this.Gi=l()?8:function(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}("undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:"")>0?6:4}initialize(t,e){this.zi=t,this.indexManager=e,this.$i=!0}getDocumentsMatchingQuery(t,e,n,r){const s={result:null};return this.ji(t,e).next(t=>{s.result=t}).next(()=>{if(!s.result)return this.Hi(t,e,r,n).next(t=>{s.result=t})}).next(()=>{if(s.result)return;const n=new ri;return this.Ji(t,e,n).next(r=>{if(s.result=r,this.Ui)return this.Yi(t,e,n,r.size)})}).next(()=>s.result)}Yi(t,e,n,r){return n.documentReadCount<this.Wi?(jt()<=b.DEBUG&&qt("QueryEngine","SDK will not create cache indexes for query:",Kn(e),"since it only creates cache indexes for collection contains","more than or equal to",this.Wi,"documents"),be.resolve()):(jt()<=b.DEBUG&&qt("QueryEngine","Query:",Kn(e),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.Gi*r?(jt()<=b.DEBUG&&qt("QueryEngine","The SDK decides to create cache indexes for query:",Kn(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,jn(e))):be.resolve())}ji(t,e){if(Un(e))return be.resolve(null);let n=jn(e);return this.indexManager.getIndexType(t,n).next(r=>0===r?null:(null!==e.limit&&1===r&&(e=qn(e,null,"F"),n=jn(e)),this.indexManager.getDocumentsMatchingTarget(t,n).next(r=>{const s=or(...r);return this.zi.getDocuments(t,s).next(r=>this.indexManager.getMinOffset(t,n).next(n=>{const i=this.Zi(e,r);return this.Xi(e,i,s,n.readTime)?this.ji(t,qn(e,null,"F")):this.es(t,i,e,n)}))})))}Hi(t,e,n,r){return Un(e)||r.isEqual(le.min())?be.resolve(null):this.zi.getDocuments(t,n).next(s=>{const i=this.Zi(e,s);return this.Xi(e,i,n,r)?be.resolve(null):(jt()<=b.DEBUG&&qt("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Kn(e)),this.es(t,i,e,function(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,s=le.fromTimestamp(1e9===r?new ue(n+1,0):new ue(n,r));return new ve(s,me.empty(),e)}(r,-1)).next(t=>t))})}Zi(t,e){let n=new Oe(Hn(t));return e.forEach((e,r)=>{Gn(t,r)&&(n=n.add(r))}),n}Xi(t,e,n,r){if(null===t.limit)return!1;if(n.size!==e.size)return!0;const s="F"===t.limitType?e.last():e.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(r)>0)}Ji(t,e,n){return jt()<=b.DEBUG&&qt("QueryEngine","Using full collection scan to execute query:",Kn(e)),this.zi.getDocumentsMatchingQuery(t,e,ve.min(),n)}es(t,e,n,r){return this.zi.getDocumentsMatchingQuery(t,n,r).next(t=>(e.forEach(e=>{t=t.insert(e.key,e)}),t))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ii{constructor(t,e,n,r){this.persistence=t,this.ts=e,this.serializer=r,this.ns=new Ne(ce),this.rs=new Wn(t=>Ln(t),Mn),this.ss=new Map,this.os=t.getRemoteDocumentCache(),this.Qr=t.getTargetCache(),this.$r=t.getBundleCache(),this._s(n)}_s(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new zs(this.os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.os.setIndexManager(this.indexManager),this.ts.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.ns))}}async function oi(t,e){const n=Qt(t);return await n.persistence.runTransaction("Handle user change","readonly",t=>{let r;return n.mutationQueue.getAllMutationBatches(t).next(s=>(r=s,n._s(e),n.mutationQueue.getAllMutationBatches(t))).next(e=>{const s=[],i=[];let o=or();for(const t of r){s.push(t.batchId);for(const e of t.mutations)o=o.add(e.key)}for(const t of e){i.push(t.batchId);for(const e of t.mutations)o=o.add(e.key)}return n.localDocuments.getDocuments(t,o).next(t=>({us:t,removedBatchIds:s,addedBatchIds:i}))})})}function ai(t){const e=Qt(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Qr.getLastRemoteSnapshotVersion(t))}function ci(t,e){const n=Qt(t),r=e.snapshotVersion;let s=n.ns;return n.persistence.runTransaction("Apply remote event","readwrite-primary",t=>{const i=n.os.newChangeBuffer({trackRemovals:!0});s=n.ns;const o=[];e.targetChanges.forEach((i,a)=>{const c=s.get(a);if(!c)return;o.push(n.Qr.removeMatchingKeys(t,i.removedDocuments,a).next(()=>n.Qr.addMatchingKeys(t,i.addedDocuments,a)));let h=c.withSequenceNumber(t.currentSequenceNumber);null!==e.targetMismatches.get(a)?h=h.withResumeToken(Fe.EMPTY_BYTE_STRING,le.min()).withLastLimboFreeSnapshotVersion(le.min()):i.resumeToken.approximateByteSize()>0&&(h=h.withResumeToken(i.resumeToken,r)),s=s.insert(a,h),function(t,e,n){return 0===t.resumeToken.approximateByteSize()||(e.snapshotVersion.toMicroseconds()-t.snapshotVersion.toMicroseconds()>=3e8||n.addedDocuments.size+n.modifiedDocuments.size+n.removedDocuments.size>0)}(c,h,i)&&o.push(n.Qr.updateTargetData(t,h))});let a=Yn(),c=or();if(e.documentUpdates.forEach(r=>{e.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(t,r))}),o.push(function(t,e,n){let r=or(),s=or();return n.forEach(t=>r=r.add(t)),e.getEntries(t,r).next(t=>{let r=Yn();return n.forEach((n,i)=>{const o=t.get(n);i.isFoundDocument()!==o.isFoundDocument()&&(s=s.add(n)),i.isNoDocument()&&i.version.isEqual(le.min())?(e.removeEntry(n,i.readTime),r=r.insert(n,i)):!o.isValidDocument()||i.version.compareTo(o.version)>0||0===i.version.compareTo(o.version)&&o.hasPendingWrites?(e.addEntry(i),r=r.insert(n,i)):qt("LocalStore","Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",i.version)}),{cs:r,ls:s}})}(t,i,e.documentUpdates).next(t=>{a=t.cs,c=t.ls})),!r.isEqual(le.min())){const e=n.Qr.getLastRemoteSnapshotVersion(t).next(e=>n.Qr.setTargetsMetadata(t,t.currentSequenceNumber,r));o.push(e)}return be.waitFor(o).next(()=>i.apply(t)).next(()=>n.localDocuments.getLocalViewOfDocuments(t,a,c)).next(()=>a)}).then(t=>(n.ns=s,t))}function hi(t,e){const n=Qt(t);return n.persistence.runTransaction("Get next mutation batch","readonly",t=>(void 0===e&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(t,e)))}async function ui(t,e,n){const r=Qt(t),s=r.ns.get(e),i=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",i,t=>r.persistence.referenceDelegate.removeTarget(t,s))}catch(t){if(!Te(t))throw t;qt("LocalStore",`Failed to update sequence numbers for target ${e}: ${t}`)}r.ns=r.ns.remove(e),r.rs.delete(s.target)}function li(t,e,n){const r=Qt(t);let s=le.min(),i=or();return r.persistence.runTransaction("Execute query","readwrite",t=>function(t,e,n){const r=Qt(t),s=r.rs.get(n);return void 0!==s?be.resolve(r.ns.get(s)):r.Qr.getTargetData(e,n)}(r,t,jn(e)).next(e=>{if(e)return s=e.lastLimboFreeSnapshotVersion,r.Qr.getMatchingKeysForTargetId(t,e.targetId).next(t=>{i=t})}).next(()=>r.ts.getDocumentsMatchingQuery(t,e,n?s:le.min(),n?i:or())).next(t=>(function(t,e,n){let r=t.ss.get(e)||le.min();n.forEach((t,e)=>{e.readTime.compareTo(r)>0&&(r=e.readTime)}),t.ss.set(e,r)}(r,function(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}(e),t),{documents:t,hs:i})))}class di{constructor(){this.activeTargetIds=ar}As(t){this.activeTargetIds=this.activeTargetIds.add(t)}Rs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}ds(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class fi{constructor(){this.no=new di,this.ro={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,n){}addLocalQueryTarget(t){return this.no.As(t),this.ro[t]||"not-current"}updateQueryState(t,e,n){this.ro[t]=e}removeLocalQueryTarget(t){this.no.Rs(t)}isLocalQueryTarget(t){return this.no.activeTargetIds.has(t)}clearQueryState(t){delete this.ro[t]}getAllActiveQueryTargets(){return this.no.activeTargetIds}isActiveQueryTarget(t){return this.no.activeTargetIds.has(t)}start(){return this.no=new di,Promise.resolve()}handleUserChange(t,e,n){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pi{io(t){}shutdown(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gi{constructor(){this.so=()=>this.oo(),this._o=()=>this.ao(),this.uo=[],this.co()}io(t){this.uo.push(t)}shutdown(){window.removeEventListener("online",this.so),window.removeEventListener("offline",this._o)}co(){window.addEventListener("online",this.so),window.addEventListener("offline",this._o)}oo(){qt("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const t of this.uo)t(0)}ao(){qt("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const t of this.uo)t(1)}static D(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let mi=null;function yi(){return null===mi?mi=268435456+Math.round(2147483648*Math.random()):mi++,"0x"+mi.toString(16)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const vi={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi{constructor(t){this.lo=t.lo,this.ho=t.ho}Po(t){this.Io=t}To(t){this.Eo=t}Ao(t){this.Ro=t}onMessage(t){this.Vo=t}close(){this.ho()}send(t){this.lo(t)}mo(){this.Io()}fo(){this.Eo()}po(t){this.Ro(t)}yo(t){this.Vo(t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _i="WebChannelConnection";class Ei extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.wo=e+"://"+t.host,this.So=`projects/${n}/databases/${r}`,this.bo="(default)"===this.databaseId.database?`project_id=${n}`:`project_id=${n}&database_id=${r}`}get Do(){return!1}Co(t,e,n,r,s){const i=yi(),o=this.vo(t,e.toUriEncodedString());qt("RestConnection",`Sending RPC '${t}' ${i}:`,o,n);const a={"google-cloud-resource-prefix":this.So,"x-goog-request-params":this.bo};return this.Fo(a,r,s),this.Mo(t,o,a,n).then(e=>(qt("RestConnection",`Received RPC '${t}' ${i}: `,e),e),e=>{throw zt("RestConnection",`RPC '${t}' ${i} failed with error: `,e,"url: ",o,"request:",n),e})}xo(t,e,n,r,s,i){return this.Co(t,e,n,r,s)}Fo(t,e,n){t["X-Goog-Api-Client"]="gl-js/ fire/"+Ut,t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach((e,n)=>t[n]=e),n&&n.headers.forEach((e,n)=>t[n]=e)}vo(t,e){const n=vi[t];return`${this.wo}/v1/${e}:${n}`}terminate(){}}{constructor(t){super(t),this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}Mo(t,e,n,r){const s=yi();return new Promise((i,o)=>{const a=new At;a.setWithCredentials(!0),a.listenOnce(Nt.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case Rt.NO_ERROR:const e=a.getResponseJson();qt(_i,`XHR for RPC '${t}' ${s} received:`,JSON.stringify(e)),i(e);break;case Rt.TIMEOUT:qt(_i,`RPC '${t}' ${s} timed out`),o(new Xt(Wt.DEADLINE_EXCEEDED,"Request time out"));break;case Rt.HTTP_ERROR:const n=a.getStatus();if(qt(_i,`RPC '${t}' ${s} failed with status:`,n,"response text:",a.getResponseText()),n>0){let t=a.getResponseJson();Array.isArray(t)&&(t=t[0]);const e=null==t?void 0:t.error;if(e&&e.status&&e.message){const t=function(t){const e=t.toLowerCase().replace(/_/g,"-");return Object.values(Wt).indexOf(e)>=0?e:Wt.UNKNOWN}(e.status);o(new Xt(t,e.message))}else o(new Xt(Wt.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new Xt(Wt.UNAVAILABLE,"Connection failed."));break;default:Gt()}}finally{qt(_i,`RPC '${t}' ${s} completed.`)}});const c=JSON.stringify(r);qt(_i,`RPC '${t}' ${s} sending request:`,r),a.send(e,"POST",c,n,15)})}Oo(t,e,n){const r=yi(),s=[this.wo,"/","google.firestore.v1.Firestore","/",t,"/channel"],i=Mt(),o=Lt(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;void 0!==c&&(a.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(a.xmlHttpFactory=new Dt({})),this.Fo(a.initMessageHeaders,e,n),a.encodeInitMessageHeaders=!0;const h=s.join("");qt(_i,`Creating RPC '${t}' stream ${r}: ${h}`,a);const u=i.createWebChannel(h,a);let l=!1,d=!1;const f=new wi({lo:e=>{d?qt(_i,`Not sending because RPC '${t}' stream ${r} is closed:`,e):(l||(qt(_i,`Opening RPC '${t}' stream ${r} transport.`),u.open(),l=!0),qt(_i,`RPC '${t}' stream ${r} sending:`,e),u.send(e))},ho:()=>u.close()}),p=(t,e,n)=>{t.listen(e,t=>{try{n(t)}catch(t){setTimeout(()=>{throw t},0)}})};return p(u,kt.EventType.OPEN,()=>{d||(qt(_i,`RPC '${t}' stream ${r} transport opened.`),f.mo())}),p(u,kt.EventType.CLOSE,()=>{d||(d=!0,qt(_i,`RPC '${t}' stream ${r} transport closed`),f.po())}),p(u,kt.EventType.ERROR,e=>{d||(d=!0,zt(_i,`RPC '${t}' stream ${r} transport errored:`,e),f.po(new Xt(Wt.UNAVAILABLE,"The operation could not be completed")))}),p(u,kt.EventType.MESSAGE,e=>{var n;if(!d){const s=e.data[0];Ht(!!s);const i=s,o=i.error||(null===(n=i[0])||void 0===n?void 0:n.error);if(o){qt(_i,`RPC '${t}' stream ${r} received error:`,o);const e=o.status;let n=function(t){const e=$r[t];if(void 0!==e)return Kr(e)}(e),s=o.message;void 0===n&&(n=Wt.INTERNAL,s="Unknown error status: "+e+" with message "+o.message),d=!0,f.po(new Xt(n,s)),u.close()}else qt(_i,`RPC '${t}' stream ${r} received:`,s),f.yo(s)}}),p(o,Ot.STAT_EVENT,e=>{e.stat===xt.PROXY?qt(_i,`RPC '${t}' stream ${r} detected buffering proxy`):e.stat===xt.NOPROXY&&qt(_i,`RPC '${t}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{f.fo()},0),f}}function bi(){return"undefined"!=typeof document?document:null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ti(t){return new hs(t,!0)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(t,e,n=1e3,r=1.5,s=6e4){this.oi=t,this.timerId=e,this.No=n,this.Lo=r,this.Bo=s,this.ko=0,this.qo=null,this.Qo=Date.now(),this.reset()}reset(){this.ko=0}Ko(){this.ko=this.Bo}$o(t){this.cancel();const e=Math.floor(this.ko+this.Uo()),n=Math.max(0,Date.now()-this.Qo),r=Math.max(0,e-n);r>0&&qt("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.ko} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.qo=this.oi.enqueueAfterDelay(this.timerId,r,()=>(this.Qo=Date.now(),t())),this.ko*=this.Lo,this.ko<this.No&&(this.ko=this.No),this.ko>this.Bo&&(this.ko=this.Bo)}Wo(){null!==this.qo&&(this.qo.skipDelay(),this.qo=null)}cancel(){null!==this.qo&&(this.qo.cancel(),this.qo=null)}Uo(){return(Math.random()-.5)*this.ko}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii{constructor(t,e,n,r,s,i,o,a){this.oi=t,this.Go=n,this.zo=r,this.connection=s,this.authCredentialsProvider=i,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.jo=0,this.Ho=null,this.Jo=null,this.stream=null,this.Yo=new Si(t,e)}Zo(){return 1===this.state||5===this.state||this.Xo()}Xo(){return 2===this.state||3===this.state}start(){4!==this.state?this.auth():this.e_()}async stop(){this.Zo()&&await this.close(0)}t_(){this.state=0,this.Yo.reset()}n_(){this.Xo()&&null===this.Ho&&(this.Ho=this.oi.enqueueAfterDelay(this.Go,6e4,()=>this.r_()))}i_(t){this.s_(),this.stream.send(t)}async r_(){if(this.Xo())return this.close(0)}s_(){this.Ho&&(this.Ho.cancel(),this.Ho=null)}o_(){this.Jo&&(this.Jo.cancel(),this.Jo=null)}async close(t,e){this.s_(),this.o_(),this.Yo.cancel(),this.jo++,4!==t?this.Yo.reset():e&&e.code===Wt.RESOURCE_EXHAUSTED?($t(e.toString()),$t("Using maximum backoff delay to prevent overloading the backend."),this.Yo.Ko()):e&&e.code===Wt.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.__(),this.stream.close(),this.stream=null),this.state=t,await this.listener.Ao(e)}__(){}auth(){this.state=1;const t=this.a_(this.jo),e=this.jo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([t,n])=>{this.jo===e&&this.u_(t,n)},e=>{t(()=>{const t=new Xt(Wt.UNKNOWN,"Fetching auth token failed: "+e.message);return this.c_(t)})})}u_(t,e){const n=this.a_(this.jo);this.stream=this.l_(t,e),this.stream.Po(()=>{n(()=>this.listener.Po())}),this.stream.To(()=>{n(()=>(this.state=2,this.Jo=this.oi.enqueueAfterDelay(this.zo,1e4,()=>(this.Xo()&&(this.state=3),Promise.resolve())),this.listener.To()))}),this.stream.Ao(t=>{n(()=>this.c_(t))}),this.stream.onMessage(t=>{n(()=>this.onMessage(t))})}e_(){this.state=5,this.Yo.$o(async()=>{this.state=0,this.start()})}c_(t){return qt("PersistentStream",`close with error: ${t}`),this.stream=null,this.close(4,t)}a_(t){return e=>{this.oi.enqueueAndForget(()=>this.jo===t?e():(qt("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Ci extends Ii{constructor(t,e,n,r,s,i){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,n,r,i),this.serializer=s}l_(t,e){return this.connection.Oo("Listen",t,e)}onMessage(t){this.Yo.reset();const e=function(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(t){return"NO_CHANGE"===t?0:"ADD"===t?1:"REMOVE"===t?2:"CURRENT"===t?3:"RESET"===t?4:Gt()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(t,e){return t.useProto3Json?(Ht(void 0===e||"string"==typeof e),Fe.fromBase64String(e||"")):(Ht(void 0===e||e instanceof Buffer||e instanceof Uint8Array),Fe.fromUint8Array(e||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(t){const e=void 0===t.code?Wt.UNKNOWN:Kr(t.code);return new Xt(e,t.message||"")}(o);n=new es(r,s,i,a||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=ws(t,r.document.name),i=ps(r.document.updateTime),o=r.document.createTime?ps(r.document.createTime):le.min(),a=new cn({mapValue:{fields:r.document.fields}}),c=un.newFoundDocument(s,i,o,a),h=r.targetIds||[],u=r.removedTargetIds||[];n=new Zr(h,u,c.key,c)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=ws(t,r.document),i=r.readTime?ps(r.readTime):le.min(),o=un.newNoDocument(s,i),a=r.removedTargetIds||[];n=new Zr([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=ws(t,r.document),i=r.removedTargetIds||[];n=new Zr([],i,s,null)}else{if(!("filter"in e))return Gt();{e.filter;const t=e.filter;t.targetId;const{count:r=0,unchangedNames:s}=t,i=new qr(r,s),o=t.targetId;n=new ts(o,i)}}return n}(this.serializer,t),n=function(t){if(!("targetChange"in t))return le.min();const e=t.targetChange;return e.targetIds&&e.targetIds.length?le.min():e.readTime?ps(e.readTime):le.min()}(t);return this.listener.h_(e,n)}P_(t){const e={};e.database=Es(this.serializer),e.addTarget=function(t,e){let n;const r=e.target;if(n=Pn(r)?{documents:Ss(t,r)}:{query:Is(t,r)._t},n.targetId=e.targetId,e.resumeToken.approximateByteSize()>0){n.resumeToken=ds(t,e.resumeToken);const r=us(t,e.expectedCount);null!==r&&(n.expectedCount=r)}else if(e.snapshotVersion.compareTo(le.min())>0){n.readTime=ls(t,e.snapshotVersion.toTimestamp());const r=us(t,e.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,t);const n=function(t,e){const n=function(t){switch(t){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Gt()}}(e.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,t);n&&(e.labels=n),this.i_(e)}I_(t){const e={};e.database=Es(this.serializer),e.removeTarget=t,this.i_(e)}}class Ai extends Ii{constructor(t,e,n,r,s,i){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,n,r,i),this.serializer=s,this.T_=!1}get E_(){return this.T_}start(){this.T_=!1,this.lastStreamToken=void 0,super.start()}__(){this.T_&&this.d_([])}l_(t,e){return this.connection.Oo("Write",t,e)}onMessage(t){if(Ht(!!t.streamToken),this.lastStreamToken=t.streamToken,this.T_){this.Yo.reset();const e=function(t,e){return t&&t.length>0?(Ht(void 0!==e),t.map(t=>function(t,e){let n=t.updateTime?ps(t.updateTime):ps(e);return n.isEqual(le.min())&&(n=ps(e)),new Tr(n,t.transformResults||[])}(t,e))):[]}(t.writeResults,t.commitTime),n=ps(t.commitTime);return this.listener.A_(n,e)}return Ht(!t.writeResults||0===t.writeResults.length),this.T_=!0,this.listener.R_()}V_(){const t={};t.database=Es(this.serializer),this.i_(t)}d_(t){const e={streamToken:this.lastStreamToken,writes:t.map(t=>function(t,e){let n;if(e instanceof xr)n={update:Ts(t,e.key,e.value)};else if(e instanceof Fr)n={delete:vs(t,e.key)};else if(e instanceof Or)n={update:Ts(t,e.key,e.data),updateMask:Ls(e.fieldMask)};else{if(!(e instanceof Vr))return Gt();n={verify:vs(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(t=>function(t,e){const n=e.transform;if(n instanceof gr)return{fieldPath:e.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof mr)return{fieldPath:e.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof vr)return{fieldPath:e.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof _r)return{fieldPath:e.field.canonicalString(),increment:n.Pe};throw Gt()}(0,t))),e.precondition.isNone||(n.currentDocument=function(t,e){return void 0!==e.updateTime?{updateTime:fs(t,e.updateTime)}:void 0!==e.exists?{exists:e.exists}:Gt()}(t,e.precondition)),n}(this.serializer,t))};this.i_(e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di extends class{}{constructor(t,e,n,r){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=n,this.serializer=r,this.m_=!1}f_(){if(this.m_)throw new Xt(Wt.FAILED_PRECONDITION,"The client has already been terminated.")}Co(t,e,n,r){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,i])=>this.connection.Co(t,ms(e,n),r,s,i)).catch(t=>{throw"FirebaseError"===t.name?(t.code===Wt.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),t):new Xt(Wt.UNKNOWN,t.toString())})}xo(t,e,n,r,s){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.xo(t,ms(e,n),r,i,o,s)).catch(t=>{throw"FirebaseError"===t.name?(t.code===Wt.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),t):new Xt(Wt.UNKNOWN,t.toString())})}terminate(){this.m_=!0,this.connection.terminate()}}class ki{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.g_=0,this.p_=null,this.y_=!0}w_(){0===this.g_&&(this.S_("Unknown"),this.p_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.p_=null,this.b_("Backend didn't respond within 10 seconds."),this.S_("Offline"),Promise.resolve())))}D_(t){"Online"===this.state?this.S_("Unknown"):(this.g_++,this.g_>=1&&(this.C_(),this.b_(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.S_("Offline")))}set(t){this.C_(),this.g_=0,"Online"===t&&(this.y_=!1),this.S_(t)}S_(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}b_(t){const e=`Could not reach Cloud Firestore backend. ${t}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.y_?($t(e),this.y_=!1):qt("OnlineStateTracker",e)}C_(){null!==this.p_&&(this.p_.cancel(),this.p_=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ni{constructor(t,e,n,r,s){this.localStore=t,this.datastore=e,this.asyncQueue=n,this.remoteSyncer={},this.v_=[],this.F_=new Map,this.M_=new Set,this.x_=[],this.O_=s,this.O_.io(t=>{n.enqueueAndForget(async()=>{Ui(this)&&(qt("RemoteStore","Restarting streams for network reachability change."),await async function(t){const e=Qt(t);e.M_.add(4),await xi(e),e.N_.set("Unknown"),e.M_.delete(4),await Ri(e)}(this))})}),this.N_=new ki(n,r)}}async function Ri(t){if(Ui(t))for(const e of t.x_)await e(!0)}async function xi(t){for(const e of t.x_)await e(!1)}function Oi(t,e){const n=Qt(t);n.F_.has(e.targetId)||(n.F_.set(e.targetId,e),Vi(n)?Fi(n):ro(n).Xo()&&Mi(n,e))}function Li(t,e){const n=Qt(t),r=ro(n);n.F_.delete(e),r.Xo()&&Pi(n,e),0===n.F_.size&&(r.Xo()?r.n_():Ui(n)&&n.N_.set("Unknown"))}function Mi(t,e){if(t.L_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(le.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}ro(t).P_(e)}function Pi(t,e){t.L_.xe(e),ro(t).I_(e)}function Fi(t){t.L_=new rs({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.F_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),ro(t).start(),t.N_.w_()}function Vi(t){return Ui(t)&&!ro(t).Zo()&&t.F_.size>0}function Ui(t){return 0===Qt(t).M_.size}function Bi(t){t.L_=void 0}async function ji(t){t.N_.set("Online")}async function qi(t){t.F_.forEach((e,n)=>{Mi(t,e)})}async function $i(t,e){Bi(t),Vi(t)?(t.N_.D_(e),Fi(t)):t.N_.set("Unknown")}async function zi(t,e,n){if(t.N_.set("Online"),e instanceof es&&2===e.state&&e.cause)try{await async function(t,e){const n=e.cause;for(const r of e.targetIds)t.F_.has(r)&&(await t.remoteSyncer.rejectListen(r,n),t.F_.delete(r),t.L_.removeTarget(r))}(t,e)}catch(n){qt("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Ki(t,n)}else if(e instanceof Zr?t.L_.Ke(e):e instanceof ts?t.L_.He(e):t.L_.We(e),!n.isEqual(le.min()))try{const e=await ai(t.localStore);n.compareTo(e)>=0&&await function(t,e){const n=t.L_.rt(e);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const s=t.F_.get(r);s&&t.F_.set(r,s.withResumeToken(n.resumeToken,e))}}),n.targetMismatches.forEach((e,n)=>{const r=t.F_.get(e);if(!r)return;t.F_.set(e,r.withResumeToken(Fe.EMPTY_BYTE_STRING,r.snapshotVersion)),Pi(t,e);const s=new Ps(r.target,e,n,r.sequenceNumber);Mi(t,s)}),t.remoteSyncer.applyRemoteEvent(n)}(t,n)}catch(e){qt("RemoteStore","Failed to raise snapshot:",e),await Ki(t,e)}}async function Ki(t,e,n){if(!Te(e))throw e;t.M_.add(1),await xi(t),t.N_.set("Offline"),n||(n=()=>ai(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{qt("RemoteStore","Retrying IndexedDB access"),await n(),t.M_.delete(1),await Ri(t)})}function Gi(t,e){return e().catch(n=>Ki(t,n,e))}async function Hi(t){const e=Qt(t),n=so(e);let r=e.v_.length>0?e.v_[e.v_.length-1].batchId:-1;for(;Qi(e);)try{const t=await hi(e.localStore,r);if(null===t){0===e.v_.length&&n.n_();break}r=t.batchId,Wi(e,t)}catch(t){await Ki(e,t)}Xi(e)&&Yi(e)}function Qi(t){return Ui(t)&&t.v_.length<10}function Wi(t,e){t.v_.push(e);const n=so(t);n.Xo()&&n.E_&&n.d_(e.mutations)}function Xi(t){return Ui(t)&&!so(t).Zo()&&t.v_.length>0}function Yi(t){so(t).start()}async function Ji(t){so(t).V_()}async function Zi(t){const e=so(t);for(const n of t.v_)e.d_(n.mutations)}async function to(t,e,n){const r=t.v_.shift(),s=Br.from(r,e,n);await Gi(t,()=>t.remoteSyncer.applySuccessfulWrite(s)),await Hi(t)}async function eo(t,e){e&&so(t).E_&&await async function(t,e){if(function(t){return function(t){switch(t){default:return Gt();case Wt.CANCELLED:case Wt.UNKNOWN:case Wt.DEADLINE_EXCEEDED:case Wt.RESOURCE_EXHAUSTED:case Wt.INTERNAL:case Wt.UNAVAILABLE:case Wt.UNAUTHENTICATED:return!1;case Wt.INVALID_ARGUMENT:case Wt.NOT_FOUND:case Wt.ALREADY_EXISTS:case Wt.PERMISSION_DENIED:case Wt.FAILED_PRECONDITION:case Wt.ABORTED:case Wt.OUT_OF_RANGE:case Wt.UNIMPLEMENTED:case Wt.DATA_LOSS:return!0}}(t)&&t!==Wt.ABORTED}(e.code)){const n=t.v_.shift();so(t).t_(),await Gi(t,()=>t.remoteSyncer.rejectFailedWrite(n.batchId,e)),await Hi(t)}}(t,e),Xi(t)&&Yi(t)}async function no(t,e){const n=Qt(t);n.asyncQueue.verifyOperationInProgress(),qt("RemoteStore","RemoteStore received new credentials");const r=Ui(n);n.M_.add(3),await xi(n),r&&n.N_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.M_.delete(3),await Ri(n)}function ro(t){return t.B_||(t.B_=function(t,e,n){const r=Qt(t);return r.f_(),new Ci(e,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}(t.datastore,t.asyncQueue,{Po:ji.bind(null,t),To:qi.bind(null,t),Ao:$i.bind(null,t),h_:zi.bind(null,t)}),t.x_.push(async e=>{e?(t.B_.t_(),Vi(t)?Fi(t):t.N_.set("Unknown")):(await t.B_.stop(),Bi(t))})),t.B_}function so(t){return t.k_||(t.k_=function(t,e,n){const r=Qt(t);return r.f_(),new Ai(e,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(t.datastore,t.asyncQueue,{Po:()=>Promise.resolve(),To:Ji.bind(null,t),Ao:eo.bind(null,t),R_:Zi.bind(null,t),A_:to.bind(null,t)}),t.x_.push(async e=>{e?(t.k_.t_(),await Hi(t)):(await t.k_.stop(),t.v_.length>0&&(qt("RemoteStore",`Stopping write stream with ${t.v_.length} pending writes`),t.v_=[]))})),t.k_
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class io{constructor(t,e,n,r,s){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=r,this.removalCallback=s,this.deferred=new Yt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(t=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,r,s){const i=Date.now()+n,o=new io(t,e,i,r,s);return o.start(n),o}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new Xt(Wt.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function oo(t,e){if($t("AsyncQueue",`${e}: ${t}`),Te(t))return new Xt(Wt.UNAVAILABLE,`${e}: ${t}`);throw t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ao{constructor(t){this.comparator=t?(e,n)=>t(e,n)||me.comparator(e.key,n.key):(t,e)=>me.comparator(t.key,e.key),this.keyedMap=Zn(),this.sortedSet=new Ne(this.comparator)}static emptySet(t){return new ao(t.comparator)}has(t){return null!=this.keyedMap.get(t)}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,n)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof ao))return!1;if(this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),n=t.sortedSet.getIterator();for(;e.hasNext();){const t=e.getNext().key,r=n.getNext().key;if(!t.isEqual(r))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),0===t.length?"DocumentSet ()":"DocumentSet (\n  "+t.join("  \n")+"\n)"}copy(t,e){const n=new ao;return n.comparator=this.comparator,n.keyedMap=t,n.sortedSet=e,n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class co{constructor(){this.q_=new Ne(me.comparator)}track(t){const e=t.doc.key,n=this.q_.get(e);n?0!==t.type&&3===n.type?this.q_=this.q_.insert(e,t):3===t.type&&1!==n.type?this.q_=this.q_.insert(e,{type:n.type,doc:t.doc}):2===t.type&&2===n.type?this.q_=this.q_.insert(e,{type:2,doc:t.doc}):2===t.type&&0===n.type?this.q_=this.q_.insert(e,{type:0,doc:t.doc}):1===t.type&&0===n.type?this.q_=this.q_.remove(e):1===t.type&&2===n.type?this.q_=this.q_.insert(e,{type:1,doc:n.doc}):0===t.type&&1===n.type?this.q_=this.q_.insert(e,{type:2,doc:t.doc}):Gt():this.q_=this.q_.insert(e,t)}Q_(){const t=[];return this.q_.inorderTraversal((e,n)=>{t.push(n)}),t}}class ho{constructor(t,e,n,r,s,i,o,a,c){this.query=t,this.docs=e,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=s,this.fromCache=i,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=c}static fromInitialDocuments(t,e,n,r,s){const i=[];return e.forEach(t=>{i.push({type:0,doc:t})}),new ho(t,e,ao.emptySet(e),i,n,r,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&$n(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,n=t.docChanges;if(e.length!==n.length)return!1;for(let r=0;r<e.length;r++)if(e[r].type!==n[r].type||!e[r].doc.isEqual(n[r].doc))return!1;return!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uo{constructor(){this.K_=void 0,this.U_=[]}W_(){return this.U_.some(t=>t.G_())}}class lo{constructor(){this.queries=new Wn(t=>zn(t),$n),this.onlineState="Unknown",this.z_=new Set}}async function fo(t,e){const n=Qt(t);let r=3;const s=e.query;let i=n.queries.get(s);i?!i.W_()&&e.G_()&&(r=2):(i=new uo,r=e.G_()?0:1);try{switch(r){case 0:i.K_=await n.onListen(s,!0);break;case 1:i.K_=await n.onListen(s,!1);break;case 2:await n.onFirstRemoteStoreListen(s)}}catch(t){const n=oo(t,`Initialization of query '${Kn(e.query)}' failed`);return void e.onError(n)}n.queries.set(s,i),i.U_.push(e),e.j_(n.onlineState),i.K_&&e.H_(i.K_)&&yo(n)}async function po(t,e){const n=Qt(t),r=e.query;let s=3;const i=n.queries.get(r);if(i){const t=i.U_.indexOf(e);t>=0&&(i.U_.splice(t,1),0===i.U_.length?s=e.G_()?0:1:!i.W_()&&e.G_()&&(s=2))}switch(s){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function go(t,e){const n=Qt(t);let r=!1;for(const s of e){const t=s.query,e=n.queries.get(t);if(e){for(const t of e.U_)t.H_(s)&&(r=!0);e.K_=s}}r&&yo(n)}function mo(t,e,n){const r=Qt(t),s=r.queries.get(e);if(s)for(const i of s.U_)i.onError(n);r.queries.delete(e)}function yo(t){t.z_.forEach(t=>{t.next()})}var vo,wo;(wo=vo||(vo={})).J_="default",wo.Cache="cache";class _o{constructor(t,e,n){this.query=t,this.Y_=e,this.Z_=!1,this.X_=null,this.onlineState="Unknown",this.options=n||{}}H_(t){if(!this.options.includeMetadataChanges){const e=[];for(const n of t.docChanges)3!==n.type&&e.push(n);t=new ho(t.query,t.docs,t.oldDocs,e,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.Z_?this.ea(t)&&(this.Y_.next(t),e=!0):this.ta(t,this.onlineState)&&(this.na(t),e=!0),this.X_=t,e}onError(t){this.Y_.error(t)}j_(t){this.onlineState=t;let e=!1;return this.X_&&!this.Z_&&this.ta(this.X_,t)&&(this.na(this.X_),e=!0),e}ta(t,e){if(!t.fromCache)return!0;if(!this.G_())return!0;const n="Offline"!==e;return(!this.options.ra||!n)&&(!t.docs.isEmpty()||t.hasCachedResults||"Offline"===e)}ea(t){if(t.docChanges.length>0)return!0;const e=this.X_&&this.X_.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&!0===this.options.includeMetadataChanges}na(t){t=ho.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.Z_=!0,this.Y_.next(t)}G_(){return this.options.source!==vo.Cache}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eo{constructor(t){this.key=t}}class bo{constructor(t){this.key=t}}class To{constructor(t,e){this.query=t,this.la=e,this.ha=null,this.hasCachedResults=!1,this.current=!1,this.Pa=or(),this.mutatedKeys=or(),this.Ia=Hn(t),this.Ta=new ao(this.Ia)}get Ea(){return this.la}da(t,e){const n=e?e.Aa:new co,r=e?e.Ta:this.Ta;let s=e?e.mutatedKeys:this.mutatedKeys,i=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,c="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(t.inorderTraversal((t,e)=>{const h=r.get(t),u=Gn(this.query,e)?e:null,l=!!h&&this.mutatedKeys.has(h.key),d=!!u&&(u.hasLocalMutations||this.mutatedKeys.has(u.key)&&u.hasCommittedMutations);let f=!1;h&&u?h.data.isEqual(u.data)?l!==d&&(n.track({type:3,doc:u}),f=!0):this.Ra(h,u)||(n.track({type:2,doc:u}),f=!0,(a&&this.Ia(u,a)>0||c&&this.Ia(u,c)<0)&&(o=!0)):!h&&u?(n.track({type:0,doc:u}),f=!0):h&&!u&&(n.track({type:1,doc:h}),f=!0,(a||c)&&(o=!0)),f&&(u?(i=i.add(u),s=d?s.add(t):s.delete(t)):(i=i.delete(t),s=s.delete(t)))}),null!==this.query.limit)for(;i.size>this.query.limit;){const t="F"===this.query.limitType?i.last():i.first();i=i.delete(t.key),s=s.delete(t.key),n.track({type:1,doc:t})}return{Ta:i,Aa:n,Xi:o,mutatedKeys:s}}Ra(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,n,r){const s=this.Ta;this.Ta=t.Ta,this.mutatedKeys=t.mutatedKeys;const i=t.Aa.Q_();i.sort((t,e)=>function(t,e){const n=t=>{switch(t){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Gt()}};return n(t)-n(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t.type,e.type)||this.Ia(t.doc,e.doc)),this.Va(n),r=null!=r&&r;const o=e&&!r?this.ma():[],a=0===this.Pa.size&&this.current&&!r?1:0,c=a!==this.ha;return this.ha=a,0!==i.length||c?{snapshot:new ho(this.query,t.Ta,s,i,t.mutatedKeys,0===a,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),fa:o}:{fa:o}}j_(t){return this.current&&"Offline"===t?(this.current=!1,this.applyChanges({Ta:this.Ta,Aa:new co,mutatedKeys:this.mutatedKeys,Xi:!1},!1)):{fa:[]}}ga(t){return!this.la.has(t)&&!!this.Ta.has(t)&&!this.Ta.get(t).hasLocalMutations}Va(t){t&&(t.addedDocuments.forEach(t=>this.la=this.la.add(t)),t.modifiedDocuments.forEach(t=>{}),t.removedDocuments.forEach(t=>this.la=this.la.delete(t)),this.current=t.current)}ma(){if(!this.current)return[];const t=this.Pa;this.Pa=or(),this.Ta.forEach(t=>{this.ga(t.key)&&(this.Pa=this.Pa.add(t.key))});const e=[];return t.forEach(t=>{this.Pa.has(t)||e.push(new bo(t))}),this.Pa.forEach(n=>{t.has(n)||e.push(new Eo(n))}),e}pa(t){this.la=t.hs,this.Pa=or();const e=this.da(t.documents);return this.applyChanges(e,!0)}ya(){return ho.fromInitialDocuments(this.query,this.Ta,this.mutatedKeys,0===this.ha,this.hasCachedResults)}}class So{constructor(t,e,n){this.query=t,this.targetId=e,this.view=n}}class Io{constructor(t){this.key=t,this.wa=!1}}class Co{constructor(t,e,n,r,s,i){this.localStore=t,this.remoteStore=e,this.eventManager=n,this.sharedClientState=r,this.currentUser=s,this.maxConcurrentLimboResolutions=i,this.Sa={},this.ba=new Wn(t=>zn(t),$n),this.Da=new Map,this.Ca=new Set,this.va=new Ne(me.comparator),this.Fa=new Map,this.Ma=new Hs,this.xa={},this.Oa=new Map,this.Na=js.Ln(),this.onlineState="Unknown",this.La=void 0}get isPrimaryClient(){return!0===this.La}}async function Ao(t,e,n=!0){const r=Qo(t);let s;const i=r.ba.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.ya()):s=await ko(r,e,n,!0),s}async function Do(t,e){const n=Qo(t);await ko(n,e,!0,!1)}async function ko(t,e,n,r){const s=await function(t,e){const n=Qt(t);return n.persistence.runTransaction("Allocate target","readwrite",t=>{let r;return n.Qr.getTargetData(t,e).next(s=>s?(r=s,be.resolve(r)):n.Qr.allocateTargetId(t).next(s=>(r=new Ps(e,s,"TargetPurposeListen",t.currentSequenceNumber),n.Qr.addTargetData(t,r).next(()=>r))))}).then(t=>{const r=n.ns.get(t.targetId);return(null===r||t.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.ns=n.ns.insert(t.targetId,t),n.rs.set(e,t.targetId)),t})}(t.localStore,jn(e)),i=s.targetId,o=n?t.sharedClientState.addLocalQueryTarget(i):"not-current";let a;return r&&(a=await async function(t,e,n,r,s){t.Ba=(e,n,r)=>async function(t,e,n,r){let s=e.view.da(n);s.Xi&&(s=await li(t.localStore,e.query,!1).then(({documents:t})=>e.view.da(t,s)));const i=r&&r.targetChanges.get(e.targetId),o=r&&null!=r.targetMismatches.get(e.targetId),a=e.view.applyChanges(s,t.isPrimaryClient,i,o);return qo(t,e.targetId,a.fa),a.snapshot}(t,e,n,r);const i=await li(t.localStore,e,!0),o=new To(e,i.hs),a=o.da(i.documents),c=Jr.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==t.onlineState,s),h=o.applyChanges(a,t.isPrimaryClient,c);qo(t,n,h.fa);const u=new So(e,n,o);return t.ba.set(e,u),t.Da.has(n)?t.Da.get(n).push(e):t.Da.set(n,[e]),h.snapshot}(t,e,i,"current"===o,s.resumeToken)),t.isPrimaryClient&&n&&Oi(t.remoteStore,s),a}async function No(t,e,n){const r=Qt(t),s=r.ba.get(e),i=r.Da.get(s.targetId);if(i.length>1)return r.Da.set(s.targetId,i.filter(t=>!$n(t,e))),void r.ba.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await ui(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),n&&Li(r.remoteStore,s.targetId),Bo(r,s.targetId)}).catch(Ee)):(Bo(r,s.targetId),await ui(r.localStore,s.targetId,!0))}async function Ro(t,e){const n=Qt(t),r=n.ba.get(e),s=n.Da.get(r.targetId);n.isPrimaryClient&&1===s.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Li(n.remoteStore,r.targetId))}async function xo(t,e,n){const r=function(t){const e=Qt(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Po.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Fo.bind(null,e),e}(t);try{const t=await function(t,e){const n=Qt(t),r=ue.now(),s=e.reduce((t,e)=>t.add(e.key),or());let i,o;return n.persistence.runTransaction("Locally write mutations","readwrite",t=>{let a=Yn(),c=or();return n.os.getEntries(t,s).next(t=>{a=t,a.forEach((t,e)=>{e.isValidDocument()||(c=c.add(t))})}).next(()=>n.localDocuments.getOverlayedDocuments(t,a)).next(s=>{i=s;const o=[];for(const t of e){const e=Nr(t,i.get(t.key).overlayedDocument);null!=e&&o.push(new Or(t.key,e,hn(e.value.mapValue),Sr.exists(!0)))}return n.mutationQueue.addMutationBatch(t,r,o,e)}).next(e=>{o=e;const r=e.applyToLocalDocumentSet(i,c);return n.documentOverlayCache.saveOverlays(t,e.batchId,r)})}).then(()=>({batchId:o.batchId,changes:tr(i)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(t.batchId),function(t,e,n){let r=t.xa[t.currentUser.toKey()];r||(r=new Ne(ce)),r=r.insert(e,n),t.xa[t.currentUser.toKey()]=r}(r,t.batchId,n),await Ko(r,t.changes),await Hi(r.remoteStore)}catch(t){const e=oo(t,"Failed to persist write");n.reject(e)}}async function Oo(t,e){const n=Qt(t);try{const t=await ci(n.localStore,e);e.targetChanges.forEach((t,e)=>{const r=n.Fa.get(e);r&&(Ht(t.addedDocuments.size+t.modifiedDocuments.size+t.removedDocuments.size<=1),t.addedDocuments.size>0?r.wa=!0:t.modifiedDocuments.size>0?Ht(r.wa):t.removedDocuments.size>0&&(Ht(r.wa),r.wa=!1))}),await Ko(n,t,e)}catch(t){await Ee(t)}}function Lo(t,e,n){const r=Qt(t);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const t=[];r.ba.forEach((n,r)=>{const s=r.view.j_(e);s.snapshot&&t.push(s.snapshot)}),function(t,e){const n=Qt(t);n.onlineState=e;let r=!1;n.queries.forEach((t,n)=>{for(const s of n.U_)s.j_(e)&&(r=!0)}),r&&yo(n)}(r.eventManager,e),t.length&&r.Sa.h_(t),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Mo(t,e,n){const r=Qt(t);r.sharedClientState.updateQueryState(e,"rejected",n);const s=r.Fa.get(e),i=s&&s.key;if(i){let t=new Ne(me.comparator);t=t.insert(i,un.newNoDocument(i,le.min()));const n=or().add(i),s=new Yr(le.min(),new Map,new Ne(ce),t,n);await Oo(r,s),r.va=r.va.remove(i),r.Fa.delete(e),zo(r)}else await ui(r.localStore,e,!1).then(()=>Bo(r,e,n)).catch(Ee)}async function Po(t,e){const n=Qt(t),r=e.batch.batchId;try{const t=await function(t,e){const n=Qt(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",t=>{const r=e.batch.keys(),s=n.os.newChangeBuffer({trackRemovals:!0});return function(t,e,n,r){const s=n.batch,i=s.keys();let o=be.resolve();return i.forEach(t=>{o=o.next(()=>r.getEntry(e,t)).next(e=>{const i=n.docVersions.get(t);Ht(null!==i),e.version.compareTo(i)<0&&(s.applyToRemoteDocument(e,n),e.isValidDocument()&&(e.setReadTime(n.commitVersion),r.addEntry(e)))})}),o.next(()=>t.mutationQueue.removeMutationBatch(e,s))}(n,t,e,s).next(()=>s.apply(t)).next(()=>n.mutationQueue.performConsistencyCheck(t)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(t,r,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(t,function(t){let e=or();for(let n=0;n<t.mutationResults.length;++n)t.mutationResults[n].transformResults.length>0&&(e=e.add(t.batch.mutations[n].key));return e}(e))).next(()=>n.localDocuments.getDocuments(t,r))})}(n.localStore,e);Uo(n,r,null),Vo(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Ko(n,t)}catch(t){await Ee(t)}}async function Fo(t,e,n){const r=Qt(t);try{const t=await function(t,e){const n=Qt(t);return n.persistence.runTransaction("Reject batch","readwrite-primary",t=>{let r;return n.mutationQueue.lookupMutationBatch(t,e).next(e=>(Ht(null!==e),r=e.keys(),n.mutationQueue.removeMutationBatch(t,e))).next(()=>n.mutationQueue.performConsistencyCheck(t)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(t,r,e)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(t,r)).next(()=>n.localDocuments.getDocuments(t,r))})}(r.localStore,e);Uo(r,e,n),Vo(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Ko(r,t)}catch(n){await Ee(n)}}function Vo(t,e){(t.Oa.get(e)||[]).forEach(t=>{t.resolve()}),t.Oa.delete(e)}function Uo(t,e,n){const r=Qt(t);let s=r.xa[r.currentUser.toKey()];if(s){const t=s.get(e);t&&(n?t.reject(n):t.resolve(),s=s.remove(e)),r.xa[r.currentUser.toKey()]=s}}function Bo(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Da.get(e))t.ba.delete(r),n&&t.Sa.ka(r,n);t.Da.delete(e),t.isPrimaryClient&&t.Ma.Vr(e).forEach(e=>{t.Ma.containsKey(e)||jo(t,e)})}function jo(t,e){t.Ca.delete(e.path.canonicalString());const n=t.va.get(e);null!==n&&(Li(t.remoteStore,n),t.va=t.va.remove(e),t.Fa.delete(n),zo(t))}function qo(t,e,n){for(const r of n)r instanceof Eo?(t.Ma.addReference(r.key,e),$o(t,r)):r instanceof bo?(qt("SyncEngine","Document no longer in limbo: "+r.key),t.Ma.removeReference(r.key,e),t.Ma.containsKey(r.key)||jo(t,r.key)):Gt()}function $o(t,e){const n=e.key,r=n.path.canonicalString();t.va.get(n)||t.Ca.has(r)||(qt("SyncEngine","New document in limbo: "+n),t.Ca.add(r),zo(t))}function zo(t){for(;t.Ca.size>0&&t.va.size<t.maxConcurrentLimboResolutions;){const e=t.Ca.values().next().value;t.Ca.delete(e);const n=new me(fe.fromString(e)),r=t.Na.next();t.Fa.set(r,new Io(n)),t.va=t.va.insert(n,r),Oi(t.remoteStore,new Ps(jn(Vn(n.path)),r,"TargetPurposeLimboResolution",Se.oe))}}async function Ko(t,e,n){const r=Qt(t),s=[],i=[],o=[];r.ba.isEmpty()||(r.ba.forEach((t,a)=>{o.push(r.Ba(a,e,n).then(t=>{if((t||n)&&r.isPrimaryClient){const e=t&&!t.fromCache;r.sharedClientState.updateQueryState(a.targetId,e?"current":"not-current")}if(t){s.push(t);const e=ni.Ki(a.targetId,t);i.push(e)}}))}),await Promise.all(o),r.Sa.h_(s),await async function(t,e){const n=Qt(t);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",t=>be.forEach(e,e=>be.forEach(e.qi,r=>n.persistence.referenceDelegate.addReference(t,e.targetId,r)).next(()=>be.forEach(e.Qi,r=>n.persistence.referenceDelegate.removeReference(t,e.targetId,r)))))}catch(t){if(!Te(t))throw t;qt("LocalStore","Failed to update sequence numbers: "+t)}for(const r of e){const t=r.targetId;if(!r.fromCache){const e=n.ns.get(t),r=e.snapshotVersion,s=e.withLastLimboFreeSnapshotVersion(r);n.ns=n.ns.insert(t,s)}}}(r.localStore,i))}async function Go(t,e){const n=Qt(t);if(!n.currentUser.isEqual(e)){qt("SyncEngine","User change. New user:",e.toKey());const t=await oi(n.localStore,e);n.currentUser=e,function(t,e){t.Oa.forEach(t=>{t.forEach(t=>{t.reject(new Xt(Wt.CANCELLED,e))})}),t.Oa.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,t.removedBatchIds,t.addedBatchIds),await Ko(n,t.us)}}function Ho(t,e){const n=Qt(t),r=n.Fa.get(e);if(r&&r.wa)return or().add(r.key);{let t=or();const r=n.Da.get(e);if(!r)return t;for(const e of r){const r=n.ba.get(e);t=t.unionWith(r.view.Ea)}return t}}function Qo(t){const e=Qt(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=Oo.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Ho.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Mo.bind(null,e),e.Sa.h_=go.bind(null,e.eventManager),e.Sa.ka=mo.bind(null,e.eventManager),e}class Wo{constructor(){this.synchronizeTabs=!1}async initialize(t){this.serializer=Ti(t.databaseInfo.databaseId),this.sharedClientState=this.createSharedClientState(t),this.persistence=this.createPersistence(t),await this.persistence.start(),this.localStore=this.createLocalStore(t),this.gcScheduler=this.createGarbageCollectionScheduler(t,this.localStore),this.indexBackfillerScheduler=this.createIndexBackfillerScheduler(t,this.localStore)}createGarbageCollectionScheduler(t,e){return null}createIndexBackfillerScheduler(t,e){return null}createLocalStore(t){return function(t,e,n,r){return new ii(t,e,n,r)}(this.persistence,new si,t.initialUser,this.serializer)}createPersistence(t){return new Zs(ei.Hr,this.serializer)}createSharedClientState(t){return new fi}async terminate(){var t,e;null===(t=this.gcScheduler)||void 0===t||t.stop(),null===(e=this.indexBackfillerScheduler)||void 0===e||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}class Xo{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=t=>Lo(this.syncEngine,t,1),this.remoteStore.remoteSyncer.handleCredentialChange=Go.bind(null,this.syncEngine),await async function(t,e){const n=Qt(t);e?(n.M_.delete(2),await Ri(n)):e||(n.M_.add(2),await xi(n),n.N_.set("Unknown"))}(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return new lo}createDatastore(t){const e=Ti(t.databaseInfo.databaseId),n=function(t){return new Ei(t)}(t.databaseInfo);return function(t,e,n,r){return new Di(t,e,n,r)}(t.authCredentials,t.appCheckCredentials,n,e)}createRemoteStore(t){return function(t,e,n,r,s){return new Ni(t,e,n,r,s)}(this.localStore,this.datastore,t.asyncQueue,t=>Lo(this.syncEngine,t,0),gi.D()?new gi:new pi)}createSyncEngine(t,e){return function(t,e,n,r,s,i,o){const a=new Co(t,e,n,r,s,i);return o&&(a.La=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t;await async function(t){const e=Qt(t);qt("RemoteStore","RemoteStore shutting down."),e.M_.add(5),await xi(e),e.O_.shutdown(),e.N_.set("Unknown")}(this.remoteStore),null===(t=this.datastore)||void 0===t||t.terminate()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yo{constructor(t){this.observer=t,this.muted=!1}next(t){this.observer.next&&this.Ka(this.observer.next,t)}error(t){this.observer.error?this.Ka(this.observer.error,t):$t("Uncaught Error in snapshot listener:",t.toString())}$a(){this.muted=!0}Ka(t,e){this.muted||setTimeout(()=>{this.muted||t(e)},0)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jo{constructor(t,e,n,r){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=n,this.databaseInfo=r,this.user=Vt.UNAUTHENTICATED,this.clientId=ae.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(n,async t=>{qt("FirestoreClient","Received user=",t.uid),await this.authCredentialListener(t),this.user=t}),this.appCheckCredentials.start(n,t=>(qt("FirestoreClient","Received new app check token=",t),this.appCheckCredentialListener(t,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new Xt(Wt.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();const t=new Yt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const n=oo(e,"Failed to shutdown persistence");t.reject(n)}}),t.promise}}async function Zo(t,e){t.asyncQueue.verifyOperationInProgress(),qt("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async t=>{r.isEqual(t)||(await oi(e.localStore,t),r=t)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function ta(t,e){t.asyncQueue.verifyOperationInProgress();const n=await async function(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){qt("FirestoreClient","Using user provided OfflineComponentProvider");try{await Zo(t,t._uninitializedComponentsProvider._offline)}catch(e){const r=e;if(!function(t){return"FirebaseError"===t.name?t.code===Wt.FAILED_PRECONDITION||t.code===Wt.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code}(r))throw r;zt("Error using user provided cache. Falling back to memory cache: "+r),await Zo(t,new Wo)}}else qt("FirestoreClient","Using default OfflineComponentProvider"),await Zo(t,new Wo);return t._offlineComponents}(t);qt("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(t=>no(e.remoteStore,t)),t.setAppCheckTokenChangeListener((t,n)=>no(e.remoteStore,n)),t._onlineComponents=e}async function ea(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(qt("FirestoreClient","Using user provided OnlineComponentProvider"),await ta(t,t._uninitializedComponentsProvider._online)):(qt("FirestoreClient","Using default OnlineComponentProvider"),await ta(t,new Xo))),t._onlineComponents}async function na(t){const e=await ea(t),n=e.eventManager;return n.onListen=Ao.bind(null,e.syncEngine),n.onUnlisten=No.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=Do.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=Ro.bind(null,e.syncEngine),n}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ra(t){const e={};return void 0!==t.timeoutSeconds&&(e.timeoutSeconds=t.timeoutSeconds),e
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const sa=new Map;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ia(t,e,n){if(!n)throw new Xt(Wt.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function oa(t){if(!me.isDocumentKey(t))throw new Xt(Wt.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function aa(t){if(me.isDocumentKey(t))throw new Xt(Wt.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function ca(t){if(void 0===t)return"undefined";if(null===t)return"null";if("string"==typeof t)return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if("number"==typeof t||"boolean"==typeof t)return""+t;if("object"==typeof t){if(t instanceof Array)return"an array";{const e=function(t){return t.constructor?t.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return"function"==typeof t?"a function":Gt()}function ha(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new Xt(Wt.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=ca(t);throw new Xt(Wt.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua{constructor(t){var e,n;if(void 0===t.host){if(void 0!==t.ssl)throw new Xt(Wt.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=t.host,this.ssl=null===(e=t.ssl)||void 0===e||e;if(this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,void 0===t.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==t.cacheSizeBytes&&t.cacheSizeBytes<1048576)throw new Xt(Wt.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}(function(t,e,n,r){if(!0===e&&!0===r)throw new Xt(Wt.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)})("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===t.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ra(null!==(n=t.experimentalLongPollingOptions)&&void 0!==n?n:{}),function(t){if(void 0!==t.timeoutSeconds){if(isNaN(t.timeoutSeconds))throw new Xt(Wt.INVALID_ARGUMENT,`invalid long polling timeout: ${t.timeoutSeconds} (must not be NaN)`);if(t.timeoutSeconds<5)throw new Xt(Wt.INVALID_ARGUMENT,`invalid long polling timeout: ${t.timeoutSeconds} (minimum allowed value is 5)`);if(t.timeoutSeconds>30)throw new Xt(Wt.INVALID_ARGUMENT,`invalid long polling timeout: ${t.timeoutSeconds} (maximum allowed value is 30)`)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(t,e){return t.timeoutSeconds===e.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class la{constructor(t,e,n,r){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ua({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new Xt(Wt.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return void 0!==this._terminateTask}_setSettings(t){if(this._settingsFrozen)throw new Xt(Wt.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ua(t),void 0!==t.credentials&&(this._authCredentials=function(t){if(!t)return new Zt;switch(t.type){case"firstParty":return new re(t.sessionIndex||"0",t.iamToken||null,t.authTokenFactory||null);case"provider":return t.client;default:throw new Xt(Wt.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const e=sa.get(t);e&&(qt("ComponentProvider","Removing Datastore"),sa.delete(t),e.terminate())}(this),Promise.resolve()}}function da(t,e,n,r={}){var i;const o=(t=ha(t,la))._getSettings(),a=`${e}:${n}`;if("firestore.googleapis.com"!==o.host&&o.host!==a&&zt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},o),{host:a,ssl:!1})),r.mockUserToken){let e,n;if("string"==typeof r.mockUserToken)e=r.mockUserToken,n=Vt.MOCK_USER;else{e=function(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=e||"demo-project",r=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[s(JSON.stringify({alg:"none",type:"JWT"})),s(JSON.stringify(o)),""].join(".")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r.mockUserToken,null===(i=t._app)||void 0===i?void 0:i.options.projectId);const o=r.mockUserToken.sub||r.mockUserToken.user_id;if(!o)throw new Xt(Wt.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new Vt(o)}t._authCredentials=new te(new Jt(e,n))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fa{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new fa(this.firestore,t,this._query)}}class pa{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ga(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new pa(this.firestore,t,this._key)}}class ga extends fa{constructor(t,e,n){super(t,e,Vn(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new pa(this.firestore,null,new me(t))}withConverter(t){return new ga(this.firestore,t,this._path)}}function ma(t,e,...n){if(t=y(t),ia("collection","path",e),t instanceof la){const r=fe.fromString(e,...n);return aa(r),new ga(t,null,r)}{if(!(t instanceof pa||t instanceof ga))throw new Xt(Wt.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(fe.fromString(e,...n));return aa(r),new ga(t.firestore,null,r)}}function ya(t,e,...n){if(t=y(t),1===arguments.length&&(e=ae.newId()),ia("doc","path",e),t instanceof la){const r=fe.fromString(e,...n);return oa(r),new pa(t,null,new me(r))}{if(!(t instanceof pa||t instanceof ga))throw new Xt(Wt.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(fe.fromString(e,...n));return oa(r),new pa(t.firestore,t instanceof ga?t.converter:null,new me(r))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class va{constructor(){this.iu=Promise.resolve(),this.su=[],this.ou=!1,this._u=[],this.au=null,this.uu=!1,this.cu=!1,this.lu=[],this.Yo=new Si(this,"async_queue_retry"),this.hu=()=>{const t=bi();t&&qt("AsyncQueue","Visibility state changed to "+t.visibilityState),this.Yo.Wo()};const t=bi();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this.hu)}get isShuttingDown(){return this.ou}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.Pu(),this.Iu(t)}enterRestrictedMode(t){if(!this.ou){this.ou=!0,this.cu=t||!1;const e=bi();e&&"function"==typeof e.removeEventListener&&e.removeEventListener("visibilitychange",this.hu)}}enqueue(t){if(this.Pu(),this.ou)return new Promise(()=>{});const e=new Yt;return this.Iu(()=>this.ou&&this.cu?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.su.push(t),this.Tu()))}async Tu(){if(0!==this.su.length){try{await this.su[0](),this.su.shift(),this.Yo.reset()}catch(t){if(!Te(t))throw t;qt("AsyncQueue","Operation failed with retryable error: "+t)}this.su.length>0&&this.Yo.$o(()=>this.Tu())}}Iu(t){const e=this.iu.then(()=>(this.uu=!0,t().catch(t=>{this.au=t,this.uu=!1;const e=function(t){let e=t.message||"";return t.stack&&(e=t.stack.includes(t.message)?t.stack:t.message+"\n"+t.stack),e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t);throw $t("INTERNAL UNHANDLED ERROR: ",e),t}).then(t=>(this.uu=!1,t))));return this.iu=e,e}enqueueAfterDelay(t,e,n){this.Pu(),this.lu.indexOf(t)>-1&&(e=0);const r=io.createAndSchedule(this,t,e,n,t=>this.Eu(t));return this._u.push(r),r}Pu(){this.au&&Gt()}verifyOperationInProgress(){}async du(){let t;do{t=this.iu,await t}while(t!==this.iu)}Au(t){for(const e of this._u)if(e.timerId===t)return!0;return!1}Ru(t){return this.du().then(()=>{this._u.sort((t,e)=>t.targetTimeMs-e.targetTimeMs);for(const e of this._u)if(e.skipDelay(),"all"!==t&&e.timerId===t)break;return this.du()})}Vu(t){this.lu.push(t)}Eu(t){const e=this._u.indexOf(t);this._u.splice(e,1)}}function wa(t){return function(t,e){if("object"!=typeof t||null===t)return!1;const n=t;for(const r of e)if(r in n&&"function"==typeof n[r])return!0;return!1}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t,["next","error","complete"])}class _a extends la{constructor(t,e,n,r){super(t,e,n,r),this.type="firestore",this._queue=new va,this._persistenceKey=(null==r?void 0:r.name)||"[DEFAULT]"}_terminate(){return this._firestoreClient||Ta(this),this._firestoreClient.terminate()}}function Ea(t,e){const n="object"==typeof t?t:function(t=rt){const e=it.get(t);if(!e&&t===rt&&h())return dt();if(!e)throw ut.create("no-app",{appName:t});return e}(),r="string"==typeof t?t:"(default)",s=function(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const t=c("firestore");t&&da(s,...t)}return s}function ba(t){return t._firestoreClient||Ta(t),t._firestoreClient.verifyNotTerminated(),t._firestoreClient}function Ta(t){var e,n,r;const s=t._freezeSettings(),i=function(t,e,n,r){return new Ke(t,e,n,r.host,r.ssl,r.experimentalForceLongPolling,r.experimentalAutoDetectLongPolling,ra(r.experimentalLongPollingOptions),r.useFetchStreams)}(t._databaseId,(null===(e=t._app)||void 0===e?void 0:e.options.appId)||"",t._persistenceKey,s);t._firestoreClient=new Jo(t._authCredentials,t._appCheckCredentials,t._queue,i),(null===(n=s.localCache)||void 0===n?void 0:n._offlineComponentProvider)&&(null===(r=s.localCache)||void 0===r?void 0:r._onlineComponentProvider)&&(t._firestoreClient._uninitializedComponentsProvider={_offlineKind:s.localCache.kind,_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sa{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Sa(Fe.fromBase64String(t))}catch(t){throw new Xt(Wt.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(t){return new Sa(Fe.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ia{constructor(...t){for(let e=0;e<t.length;++e)if(0===t[e].length)throw new Xt(Wt.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ge(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ca{constructor(t){this._methodName=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aa{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new Xt(Wt.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new Xt(Wt.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return ce(this._lat,t._lat)||ce(this._long,t._long)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Da=/^__.*__$/;class ka{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return null!==this.fieldMask?new Or(t,this.data,this.fieldMask,e,this.fieldTransforms):new xr(t,this.data,e,this.fieldTransforms)}}class Na{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return new Or(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function Ra(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Gt()}}class xa{constructor(t,e,n,r,s,i){this.settings=t,this.databaseId=e,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===s&&this.mu(),this.fieldTransforms=s||[],this.fieldMask=i||[]}get path(){return this.settings.path}get fu(){return this.settings.fu}gu(t){return new xa(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}pu(t){var e;const n=null===(e=this.path)||void 0===e?void 0:e.child(t),r=this.gu({path:n,yu:!1});return r.wu(t),r}Su(t){var e;const n=null===(e=this.path)||void 0===e?void 0:e.child(t),r=this.gu({path:n,yu:!1});return r.mu(),r}bu(t){return this.gu({path:void 0,yu:!0})}Du(t){return za(t,this.settings.methodName,this.settings.Cu||!1,this.path,this.settings.vu)}contains(t){return void 0!==this.fieldMask.find(e=>t.isPrefixOf(e))||void 0!==this.fieldTransforms.find(e=>t.isPrefixOf(e.field))}mu(){if(this.path)for(let t=0;t<this.path.length;t++)this.wu(this.path.get(t))}wu(t){if(0===t.length)throw this.Du("Document fields must not be empty");if(Ra(this.fu)&&Da.test(t))throw this.Du('Document fields cannot begin and end with "__"')}}class Oa{constructor(t,e,n){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=n||Ti(t)}Fu(t,e,n,r=!1){return new xa({fu:t,methodName:e,vu:n,path:ge.emptyPath(),yu:!1,Cu:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function La(t){const e=t._freezeSettings(),n=Ti(t._databaseId);return new Oa(t._databaseId,!!e.ignoreUndefinedProperties,n)}function Ma(t,e,n,r,s,i={}){const o=t.Fu(i.merge||i.mergeFields?2:0,e,n,s);Ba("Data must be an object, but it was:",o,r);const a=Va(r,o);let c,h;if(i.merge)c=new Me(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const t=[];for(const r of i.mergeFields){const s=ja(e,r,n);if(!o.contains(s))throw new Xt(Wt.INVALID_ARGUMENT,`Field '${s}' is specified in your field mask but missing from your input data.`);Ka(t,s)||t.push(s)}c=new Me(t),h=o.fieldTransforms.filter(t=>c.covers(t.field))}else c=null,h=o.fieldTransforms;return new ka(new cn(a),c,h)}class Pa extends Ca{_toFieldTransform(t){if(2!==t.fu)throw 1===t.fu?t.Du(`${this._methodName}() can only appear at the top level of your update data`):t.Du(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Pa}}function Fa(t,e){if(Ua(t=y(t)))return Ba("Unsupported field value:",e,t),Va(t,e);if(t instanceof Ca)return function(t,e){if(!Ra(e.fu))throw e.Du(`${t._methodName}() can only be used with update() and set()`);if(!e.path)throw e.Du(`${t._methodName}() is not currently supported inside arrays`);const n=t._toFieldTransform(e);n&&e.fieldTransforms.push(n)}(t,e),null;if(void 0===t&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.yu&&4!==e.fu)throw e.Du("Nested arrays are not supported");return function(t,e){const n=[];let r=0;for(const s of t){let t=Fa(s,e.bu(r));null==t&&(t={nullValue:"NULL_VALUE"}),n.push(t),r++}return{arrayValue:{values:n}}}(t,e)}return function(t,e){if(null===(t=y(t)))return{nullValue:"NULL_VALUE"};if("number"==typeof t)return ur(e.serializer,t);if("boolean"==typeof t)return{booleanValue:t};if("string"==typeof t)return{stringValue:t};if(t instanceof Date){const n=ue.fromDate(t);return{timestampValue:ls(e.serializer,n)}}if(t instanceof ue){const n=new ue(t.seconds,1e3*Math.floor(t.nanoseconds/1e3));return{timestampValue:ls(e.serializer,n)}}if(t instanceof Aa)return{geoPointValue:{latitude:t.latitude,longitude:t.longitude}};if(t instanceof Sa)return{bytesValue:ds(e.serializer,t._byteString)};if(t instanceof pa){const n=e.databaseId,r=t.firestore._databaseId;if(!r.isEqual(n))throw e.Du(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:gs(t.firestore._databaseId||e.databaseId,t._key.path)}}throw e.Du(`Unsupported field value: ${ca(t)}`)}(t,e)}function Va(t,e){const n={};return ke(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):De(t,(t,r)=>{const s=Fa(r,e.pu(t));null!=s&&(n[t]=s)}),{mapValue:{fields:n}}}function Ua(t){return!("object"!=typeof t||null===t||t instanceof Array||t instanceof Date||t instanceof ue||t instanceof Aa||t instanceof Sa||t instanceof pa||t instanceof Ca)}function Ba(t,e,n){if(!Ua(n)||!function(t){return"object"==typeof t&&null!==t&&(Object.getPrototypeOf(t)===Object.prototype||null===Object.getPrototypeOf(t))}(n)){const r=ca(n);throw"an object"===r?e.Du(t+" a custom object"):e.Du(t+" "+r)}}function ja(t,e,n){if((e=y(e))instanceof Ia)return e._internalPath;if("string"==typeof e)return $a(t,e);throw za("Field path arguments must be of type string or ",t,!1,void 0,n)}const qa=new RegExp("[~\\*/\\[\\]]");function $a(t,e,n){if(e.search(qa)>=0)throw za(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Ia(...e.split("."))._internalPath}catch(r){throw za(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function za(t,e,n,r,s){const i=r&&!r.isEmpty(),o=void 0!==s;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${r}`),o&&(c+=` in document ${s}`),c+=")"),new Xt(Wt.INVALID_ARGUMENT,a+t+c)}function Ka(t,e){return t.some(t=>t.isEqual(e))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(t,e,n,r,s){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=r,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new pa(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const t=new Ha(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(Qa("DocumentSnapshot.get",t));if(null!==e)return this._userDataWriter.convertValue(e)}}}class Ha extends Ga{data(){return super.data()}}function Qa(t,e){return"string"==typeof e?$a(t,e):e instanceof Ia?e._internalPath:e._delegate._internalPath}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wa(t){if("L"===t.limitType&&0===t.explicitOrderBy.length)throw new Xt(Wt.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Xa{convertValue(t,e="none"){switch(Qe(t)){case 0:return null;case 1:return t.booleanValue;case 2:return Be(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(je(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 10:return this.convertObject(t.mapValue,e);default:throw Gt()}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const n={};return De(t,(t,r)=>{n[t]=this.convertValue(r,e)}),n}convertGeoPoint(t){return new Aa(Be(t.latitude),Be(t.longitude))}convertArray(t,e){return(t.values||[]).map(t=>this.convertValue(t,e))}convertServerTimestamp(t,e){switch(e){case"previous":const n=$e(t);return null==n?null:this.convertValue(n,e);case"estimate":return this.convertTimestamp(ze(t));default:return null}}convertTimestamp(t){const e=Ue(t);return new ue(e.seconds,e.nanos)}convertDocumentKey(t,e){const n=fe.fromString(t);Ht(Ms(n));const r=new Ge(n.get(1),n.get(3)),s=new me(n.popFirst(5));return r.isEqual(e)||$t(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),s}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ya{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Ja extends Ga{constructor(t,e,n,r,s,i){super(t,e,n,r,i),this._firestore=t,this._firestoreImpl=t,this.metadata=s}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Za(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const n=this._document.data.field(Qa("DocumentSnapshot.get",t));if(null!==n)return this._userDataWriter.convertValue(n,e.serverTimestamps)}}}class Za extends Ja{data(t={}){return super.data(t)}}class tc{constructor(t,e,n,r){this._firestore=t,this._userDataWriter=e,this._snapshot=r,this.metadata=new Ya(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(t,e){this._snapshot.docs.forEach(n=>{t.call(e,new Za(this._firestore,this._userDataWriter,n.key,n,new Ya(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new Xt(Wt.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(t,e){if(t._snapshot.oldDocs.isEmpty()){let e=0;return t._snapshot.docChanges.map(n=>{const r=new Za(t._firestore,t._userDataWriter,n.doc.key,n.doc,new Ya(t._snapshot.mutatedKeys.has(n.doc.key),t._snapshot.fromCache),t.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:e++}})}{let n=t._snapshot.oldDocs;return t._snapshot.docChanges.filter(t=>e||3!==t.type).map(e=>{const r=new Za(t._firestore,t._userDataWriter,e.doc.key,e.doc,new Ya(t._snapshot.mutatedKeys.has(e.doc.key),t._snapshot.fromCache),t.query.converter);let s=-1,i=-1;return 0!==e.type&&(s=n.indexOf(e.doc.key),n=n.delete(e.doc.key)),1!==e.type&&(n=n.add(e.doc),i=n.indexOf(e.doc.key)),{type:ec(e.type),doc:r,oldIndex:s,newIndex:i}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}}function ec(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Gt()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nc(t){t=ha(t,pa);const e=ha(t.firestore,_a);return function(t,e,n={}){const r=new Yt;return t.asyncQueue.enqueueAndForget(async()=>function(t,e,n,r,s){const i=new Yo({next:i=>{e.enqueueAndForget(()=>po(t,o));const a=i.docs.has(n);!a&&i.fromCache?s.reject(new Xt(Wt.UNAVAILABLE,"Failed to get document because the client is offline.")):a&&i.fromCache&&r&&"server"===r.source?s.reject(new Xt(Wt.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):s.resolve(i)},error:t=>s.reject(t)}),o=new _o(Vn(n.path),i,{includeMetadataChanges:!0,ra:!0});return fo(t,o)}(await na(t),t.asyncQueue,e,n,r)),r.promise}(ba(e),t._key).then(n=>hc(e,t,n))}class rc extends Xa{constructor(t){super(),this.firestore=t}convertBytes(t){return new Sa(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new pa(this.firestore,null,e)}}function sc(t){t=ha(t,fa);const e=ha(t.firestore,_a),n=ba(e),r=new rc(e);return Wa(t._query),function(t,e,n={}){const r=new Yt;return t.asyncQueue.enqueueAndForget(async()=>function(t,e,n,r,s){const i=new Yo({next:n=>{e.enqueueAndForget(()=>po(t,o)),n.fromCache&&"server"===r.source?s.reject(new Xt(Wt.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):s.resolve(n)},error:t=>s.reject(t)}),o=new _o(n,i,{includeMetadataChanges:!0,ra:!0});return fo(t,o)}(await na(t),t.asyncQueue,e,n,r)),r.promise}(n,t._query).then(n=>new tc(e,r,t,n))}function ic(t,e,n){t=ha(t,pa);const r=ha(t.firestore,_a),s=function(t,e){let n;return n=t?t.toFirestore(e):e,n}(t.converter,e);return cc(r,[Ma(La(r),"setDoc",t._key,s,null!==t.converter,n).toMutation(t._key,Sr.none())])}function oc(t,e,n,...r){t=ha(t,pa);const s=ha(t.firestore,_a),i=La(s);let o;return o="string"==typeof(e=y(e))||e instanceof Ia?function(t,e,n,r,s,i){const o=t.Fu(1,e,n),a=[ja(e,r,n)],c=[s];if(i.length%2!=0)throw new Xt(Wt.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<i.length;d+=2)a.push(ja(e,i[d])),c.push(i[d+1]);const h=[],u=cn.empty();for(let d=a.length-1;d>=0;--d)if(!Ka(h,a[d])){const t=a[d];let e=c[d];e=y(e);const n=o.Su(t);if(e instanceof Pa)h.push(t);else{const r=Fa(e,n);null!=r&&(h.push(t),u.set(t,r))}}const l=new Me(h);return new Na(u,l,o.fieldTransforms)}(i,"updateDoc",t._key,e,n,r):function(t,e,n,r){const s=t.Fu(1,e,n);Ba("Data must be an object, but it was:",s,r);const i=[],o=cn.empty();De(r,(t,r)=>{const a=$a(e,t,n);r=y(r);const c=s.Su(a);if(r instanceof Pa)i.push(a);else{const t=Fa(r,c);null!=t&&(i.push(a),o.set(a,t))}});const a=new Me(i);return new Na(o,a,s.fieldTransforms)}(i,"updateDoc",t._key,e),cc(s,[o.toMutation(t._key,Sr.exists(!0))])}function ac(t,...e){var n,r,s;t=y(t);let i={includeMetadataChanges:!1,source:"default"},o=0;"object"!=typeof e[o]||wa(e[o])||(i=e[o],o++);const a={includeMetadataChanges:i.includeMetadataChanges,source:i.source};if(wa(e[o])){const t=e[o];e[o]=null===(n=t.next)||void 0===n?void 0:n.bind(t),e[o+1]=null===(r=t.error)||void 0===r?void 0:r.bind(t),e[o+2]=null===(s=t.complete)||void 0===s?void 0:s.bind(t)}let c,h,u;if(t instanceof pa)h=ha(t.firestore,_a),u=Vn(t._key.path),c={next:n=>{e[o]&&e[o](hc(h,t,n))},error:e[o+1],complete:e[o+2]};else{const n=ha(t,fa);h=ha(n.firestore,_a),u=n._query;const r=new rc(h);c={next:t=>{e[o]&&e[o](new tc(h,r,n,t))},error:e[o+1],complete:e[o+2]},Wa(t._query)}return function(t,e,n,r){const s=new Yo(r),i=new _o(e,s,n);return t.asyncQueue.enqueueAndForget(async()=>fo(await na(t),i)),()=>{s.$a(),t.asyncQueue.enqueueAndForget(async()=>po(await na(t),i))}}(ba(h),u,a,c)}function cc(t,e){return function(t,e){const n=new Yt;return t.asyncQueue.enqueueAndForget(async()=>xo(await function(t){return ea(t).then(t=>t.syncEngine)}(t),e,n)),n.promise}(ba(t),e)}function hc(t,e,n){const r=n.docs.get(e._key),s=new rc(t);return new Ja(t,s,e._key,r,new Ya(n.hasPendingWrites,n.fromCache),e.converter)}!function(t,e=!0){!function(t){Ut=t}("10.12.2"),ht(new v("firestore",(t,{instanceIdentifier:n,options:r})=>{const s=t.getProvider("app").getImmediate(),i=new _a(new ee(t.getProvider("auth-internal")),new ie(t.getProvider("app-check-internal")),function(t,e){if(!Object.prototype.hasOwnProperty.apply(t.options,["projectId"]))throw new Xt(Wt.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ge(t.options.projectId,e)}(s,n),s);return r=Object.assign({useFetchStreams:e},r),i._setSettings(r),i},"PUBLIC").setMultipleInstances(!0)),ft(Ft,"4.6.3",t),ft(Ft,"4.6.3","esm2017")}();
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
ft("firebase","10.12.2","app");export{sc as a,nc as b,ma as c,ya as d,Ea as g,dt as i,ac as o,ic as s,oc as u};
