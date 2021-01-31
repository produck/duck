/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "67361d08a279f7370b181d0b6b513519"
  },
  {
    "url": "assets/css/0.styles.25ae91cb.css",
    "revision": "b6cdc5749814918ac778a512899dfbd8"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.9a33d6d9.js",
    "revision": "0f6d5d6b3d6be09bd57e801a4ff22251"
  },
  {
    "url": "assets/js/11.c6dbefc8.js",
    "revision": "55b57635c1aa4b317f60faf8155dbfe3"
  },
  {
    "url": "assets/js/12.a8432ee5.js",
    "revision": "e269d183e2cc5399a5cfb7a0dd867c10"
  },
  {
    "url": "assets/js/13.4a93e498.js",
    "revision": "914f6e4067b5809c2fad7b824d137c27"
  },
  {
    "url": "assets/js/14.634c0f66.js",
    "revision": "f00734bfc6131200b665b92a1349f325"
  },
  {
    "url": "assets/js/15.7ed70c69.js",
    "revision": "48acf8cbdacf1405f4951c28a0c7e107"
  },
  {
    "url": "assets/js/16.22b178f4.js",
    "revision": "1772b13b05f2298991636b190e553160"
  },
  {
    "url": "assets/js/17.1e006bae.js",
    "revision": "a56521519b47c55cc1cccdbbb17e7c66"
  },
  {
    "url": "assets/js/18.1a9ee776.js",
    "revision": "47e39d38c52b29c79ef53594306871c1"
  },
  {
    "url": "assets/js/19.c573cefc.js",
    "revision": "f02194eaa5ae4b2974fc5e7c927ebb91"
  },
  {
    "url": "assets/js/2.68641783.js",
    "revision": "1c426cee0f00480eadf8b55ba43c5b27"
  },
  {
    "url": "assets/js/20.0dbc2cbe.js",
    "revision": "2224b75bc1e23b5e365150b5c59d618f"
  },
  {
    "url": "assets/js/21.fb627d11.js",
    "revision": "fd0290e66e80220ec8e71c34202b261d"
  },
  {
    "url": "assets/js/22.9c19c578.js",
    "revision": "3902f945aee05d76063d02fbae34313c"
  },
  {
    "url": "assets/js/23.4af12f95.js",
    "revision": "85c23d9ac849dd3a6f6b40bef17e9440"
  },
  {
    "url": "assets/js/24.30126934.js",
    "revision": "3b2f0be48be9b8db2ffdd534f93fcb63"
  },
  {
    "url": "assets/js/3.5c5a2781.js",
    "revision": "1f406221059f1ba3a4fa96243d95ca6e"
  },
  {
    "url": "assets/js/4.51a0d4cb.js",
    "revision": "075a9e75f3575ee2438f8727cc85dfe6"
  },
  {
    "url": "assets/js/5.dbfe0154.js",
    "revision": "350af5343f320d169fca6eaa61c72966"
  },
  {
    "url": "assets/js/6.9558f2c9.js",
    "revision": "e08b48ecf0264477b824466bc3dd6cb4"
  },
  {
    "url": "assets/js/7.7bf8847f.js",
    "revision": "92c5779e1c3d10c677ec1593049bd21e"
  },
  {
    "url": "assets/js/8.c03a0769.js",
    "revision": "ecf97c4454fa3290bc070d04dce53b9c"
  },
  {
    "url": "assets/js/9.2ceaea63.js",
    "revision": "102b9f60da498f294b426cce52f8f1eb"
  },
  {
    "url": "assets/js/app.5351e437.js",
    "revision": "42136c50364040e2b6c5c8f57dc87fff"
  },
  {
    "url": "guide/developing-a-component.html",
    "revision": "ca5c457eeff9bb5a8e0fe5dc0306d6c1"
  },
  {
    "url": "guide/directory-structure.html",
    "revision": "5041559257638418da138f36ec2d1565"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "668d67b9817dbfcba06c593974dcb2df"
  },
  {
    "url": "guide/index.html",
    "revision": "bf55a71fcd136a8878cc3f4e41554471"
  },
  {
    "url": "guide/injection.html",
    "revision": "b2a7bcb5bf770e5c75231ef352da73be"
  },
  {
    "url": "guide/using-component.html",
    "revision": "9bbb9597a7253012d30247727a154c4e"
  },
  {
    "url": "guide/web-application.html",
    "revision": "1004f57342c68ccbba2bfef84a5d2de5"
  },
  {
    "url": "index.html",
    "revision": "4746023ecbd584b56df745d078f01835"
  },
  {
    "url": "langs/zh/guide/developing-a-component.html",
    "revision": "dd45e890b1bcb653a5f58bc6c8254833"
  },
  {
    "url": "langs/zh/guide/directory-structure.html",
    "revision": "6894020867ad5b0df4bec5674de21cc3"
  },
  {
    "url": "langs/zh/guide/getting-started.html",
    "revision": "bbd1b6ef4a4bda6fbf1917c9f2c7ab77"
  },
  {
    "url": "langs/zh/guide/index.html",
    "revision": "8865b1bc98f6b889be5be89c83eb3148"
  },
  {
    "url": "langs/zh/guide/injection.html",
    "revision": "e4bd62f5feab8c056733d676b3e6e4e1"
  },
  {
    "url": "langs/zh/guide/using-component.html",
    "revision": "8167c8677cbec5f31b8eb4d983679fc0"
  },
  {
    "url": "langs/zh/guide/web-application.html",
    "revision": "9e478b7f98bf7f7f17f09b9ac3df05a2"
  },
  {
    "url": "langs/zh/index.html",
    "revision": "d9084ea430380ef2c5f83295c1cfb3bf"
  },
  {
    "url": "logo.png",
    "revision": "8f93aa5a6f1a16f9198e24ac914c0b65"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
