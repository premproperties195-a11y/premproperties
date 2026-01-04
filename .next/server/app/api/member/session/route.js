"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/member/session/route";
exports.ids = ["app/api/member/session/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmember%2Fsession%2Froute&page=%2Fapi%2Fmember%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmember%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5Csridh%5COneDrive%5CDesktop%5Creal-estate-project%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Csridh%5COneDrive%5CDesktop%5Creal-estate-project%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmember%2Fsession%2Froute&page=%2Fapi%2Fmember%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmember%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5Csridh%5COneDrive%5CDesktop%5Creal-estate-project%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Csridh%5COneDrive%5CDesktop%5Creal-estate-project%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_sridh_OneDrive_Desktop_real_estate_project_frontend_app_api_member_session_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/member/session/route.ts */ \"(rsc)/./app/api/member/session/route.ts\");\n\r\n\r\n\r\n\r\n// We inject the nextConfigOutput here so that we can use them in the route\r\n// module.\r\nconst nextConfigOutput = \"\"\r\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\r\n    definition: {\r\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\r\n        page: \"/api/member/session/route\",\r\n        pathname: \"/api/member/session\",\r\n        filename: \"route\",\r\n        bundlePath: \"app/api/member/session/route\"\r\n    },\r\n    resolvedPagePath: \"C:\\\\Users\\\\sridh\\\\OneDrive\\\\Desktop\\\\real-estate-project\\\\frontend\\\\app\\\\api\\\\member\\\\session\\\\route.ts\",\r\n    nextConfigOutput,\r\n    userland: C_Users_sridh_OneDrive_Desktop_real_estate_project_frontend_app_api_member_session_route_ts__WEBPACK_IMPORTED_MODULE_3__\r\n});\r\n// Pull out the exports that we need to expose from the module. This should\r\n// be eliminated when we've moved the other routes to the new format. These\r\n// are used to hook into the route.\r\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\r\nconst originalPathname = \"/api/member/session/route\";\r\nfunction patchFetch() {\r\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\r\n        serverHooks,\r\n        staticGenerationAsyncStorage\r\n    });\r\n}\r\n\r\n\r\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZtZW1iZXIlMkZzZXNzaW9uJTJGcm91dGUmcGFnZT0lMkZhcGklMkZtZW1iZXIlMkZzZXNzaW9uJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGbWVtYmVyJTJGc2Vzc2lvbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNzcmlkaCU1Q09uZURyaXZlJTVDRGVza3RvcCU1Q3JlYWwtZXN0YXRlLXByb2plY3QlNUNmcm9udGVuZCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDc3JpZGglNUNPbmVEcml2ZSU1Q0Rlc2t0b3AlNUNyZWFsLWVzdGF0ZS1wcm9qZWN0JTVDZnJvbnRlbmQmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3VEO0FBQ3BJO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7QUFDdkg7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3JlYWwtZXN0YXRlLWZyb250ZW5kLz85MTNhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XHJcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XHJcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcclxuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXHNyaWRoXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxccmVhbC1lc3RhdGUtcHJvamVjdFxcXFxmcm9udGVuZFxcXFxhcHBcXFxcYXBpXFxcXG1lbWJlclxcXFxzZXNzaW9uXFxcXHJvdXRlLnRzXCI7XHJcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxyXG4vLyBtb2R1bGUuXHJcbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXHJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xyXG4gICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXHJcbiAgICAgICAgcGFnZTogXCIvYXBpL21lbWJlci9zZXNzaW9uL3JvdXRlXCIsXHJcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9tZW1iZXIvc2Vzc2lvblwiLFxyXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXHJcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL21lbWJlci9zZXNzaW9uL3JvdXRlXCJcclxuICAgIH0sXHJcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXHNyaWRoXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxccmVhbC1lc3RhdGUtcHJvamVjdFxcXFxmcm9udGVuZFxcXFxhcHBcXFxcYXBpXFxcXG1lbWJlclxcXFxzZXNzaW9uXFxcXHJvdXRlLnRzXCIsXHJcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxyXG4gICAgdXNlcmxhbmRcclxufSk7XHJcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxyXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2VcclxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cclxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XHJcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvbWVtYmVyL3Nlc3Npb24vcm91dGVcIjtcclxuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcclxuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XHJcbiAgICAgICAgc2VydmVySG9va3MsXHJcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcclxuXHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmember%2Fsession%2Froute&page=%2Fapi%2Fmember%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmember%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5Csridh%5COneDrive%5CDesktop%5Creal-estate-project%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Csridh%5COneDrive%5CDesktop%5Creal-estate-project%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/member/session/route.ts":
/*!*****************************************!*\
  !*** ./app/api/member/session/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_memberAuth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/memberAuth */ \"(rsc)/./app/lib/memberAuth.ts\");\n\n\nasync function GET() {\n    const session = await (0,_lib_memberAuth__WEBPACK_IMPORTED_MODULE_1__.getMemberSession)();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(session || {\n        authenticated: false\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL21lbWJlci9zZXNzaW9uL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEyQztBQUNnQjtBQUVwRCxlQUFlRTtJQUNsQixNQUFNQyxVQUFVLE1BQU1GLGlFQUFnQkE7SUFDdEMsT0FBT0QscURBQVlBLENBQUNJLElBQUksQ0FBQ0QsV0FBVztRQUFFRSxlQUFlO0lBQU07QUFDL0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFsLWVzdGF0ZS1mcm9udGVuZC8uL2FwcC9hcGkvbWVtYmVyL3Nlc3Npb24vcm91dGUudHM/MzEzYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IHsgZ2V0TWVtYmVyU2Vzc2lvbiB9IGZyb20gXCIuLi8uLi8uLi9saWIvbWVtYmVyQXV0aFwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRNZW1iZXJTZXNzaW9uKCk7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oc2Vzc2lvbiB8fCB7IGF1dGhlbnRpY2F0ZWQ6IGZhbHNlIH0pO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJnZXRNZW1iZXJTZXNzaW9uIiwiR0VUIiwic2Vzc2lvbiIsImpzb24iLCJhdXRoZW50aWNhdGVkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/member/session/route.ts\n");

/***/ }),

/***/ "(rsc)/./app/lib/memberAuth.ts":
/*!*******************************!*\
  !*** ./app/lib/memberAuth.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getMemberSession: () => (/* binding */ getMemberSession),\n/* harmony export */   isMember: () => (/* binding */ isMember)\n/* harmony export */ });\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\nasync function getMemberSession() {\n    const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    const session = cookieStore.get(\"member-session\");\n    if (!session) return null;\n    try {\n        const decodedValue = decodeURIComponent(session.value);\n        const decoded = JSON.parse(Buffer.from(decodedValue, \"base64\").toString(\"utf-8\"));\n        if (decoded && decoded.authenticated) {\n            return decoded;\n        }\n        return null;\n    } catch (e) {\n        return null;\n    }\n}\nasync function isMember() {\n    const session = await getMemberSession();\n    return !!session;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbGliL21lbWJlckF1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXVDO0FBRWhDLGVBQWVDO0lBQ2xCLE1BQU1DLGNBQWNGLHFEQUFPQTtJQUMzQixNQUFNRyxVQUFVRCxZQUFZRSxHQUFHLENBQUM7SUFFaEMsSUFBSSxDQUFDRCxTQUFTLE9BQU87SUFFckIsSUFBSTtRQUNBLE1BQU1FLGVBQWVDLG1CQUFtQkgsUUFBUUksS0FBSztRQUNyRCxNQUFNQyxVQUFVQyxLQUFLQyxLQUFLLENBQUNDLE9BQU9DLElBQUksQ0FBQ1AsY0FBYyxVQUFVUSxRQUFRLENBQUM7UUFFeEUsSUFBSUwsV0FBV0EsUUFBUU0sYUFBYSxFQUFFO1lBQ2xDLE9BQU9OO1FBQ1g7UUFDQSxPQUFPO0lBQ1gsRUFBRSxPQUFPTyxHQUFHO1FBQ1IsT0FBTztJQUNYO0FBQ0o7QUFFTyxlQUFlQztJQUNsQixNQUFNYixVQUFVLE1BQU1GO0lBQ3RCLE9BQU8sQ0FBQyxDQUFDRTtBQUNiIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVhbC1lc3RhdGUtZnJvbnRlbmQvLi9hcHAvbGliL21lbWJlckF1dGgudHM/NTE4YSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb29raWVzIH0gZnJvbSBcIm5leHQvaGVhZGVyc1wiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE1lbWJlclNlc3Npb24oKSB7XHJcbiAgICBjb25zdCBjb29raWVTdG9yZSA9IGNvb2tpZXMoKTtcclxuICAgIGNvbnN0IHNlc3Npb24gPSBjb29raWVTdG9yZS5nZXQoXCJtZW1iZXItc2Vzc2lvblwiKTtcclxuXHJcbiAgICBpZiAoIXNlc3Npb24pIHJldHVybiBudWxsO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZGVjb2RlZFZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KHNlc3Npb24udmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IGRlY29kZWQgPSBKU09OLnBhcnNlKEJ1ZmZlci5mcm9tKGRlY29kZWRWYWx1ZSwgXCJiYXNlNjRcIikudG9TdHJpbmcoXCJ1dGYtOFwiKSk7XHJcblxyXG4gICAgICAgIGlmIChkZWNvZGVkICYmIGRlY29kZWQuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc01lbWJlcigpIHtcclxuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRNZW1iZXJTZXNzaW9uKCk7XHJcbiAgICByZXR1cm4gISFzZXNzaW9uO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJjb29raWVzIiwiZ2V0TWVtYmVyU2Vzc2lvbiIsImNvb2tpZVN0b3JlIiwic2Vzc2lvbiIsImdldCIsImRlY29kZWRWYWx1ZSIsImRlY29kZVVSSUNvbXBvbmVudCIsInZhbHVlIiwiZGVjb2RlZCIsIkpTT04iLCJwYXJzZSIsIkJ1ZmZlciIsImZyb20iLCJ0b1N0cmluZyIsImF1dGhlbnRpY2F0ZWQiLCJlIiwiaXNNZW1iZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/memberAuth.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmember%2Fsession%2Froute&page=%2Fapi%2Fmember%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmember%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5Csridh%5COneDrive%5CDesktop%5Creal-estate-project%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Csridh%5COneDrive%5CDesktop%5Creal-estate-project%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();