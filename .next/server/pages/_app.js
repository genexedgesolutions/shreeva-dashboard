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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/AuthProvider.jsx":
/*!*************************************!*\
  !*** ./components/AuthProvider.jsx ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/api */ \"./lib/api.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_api__WEBPACK_IMPORTED_MODULE_2__]);\n_lib_api__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// components/AuthProvider.jsx\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    // Load user from localStorage on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const savedUser = localStorage.getItem(\"user\");\n        if (savedUser) {\n            setUser(JSON.parse(savedUser));\n        }\n        setLoading(false);\n    }, []);\n    // Login API call\n    async function login({ email, password }) {\n        try {\n            const res = await _lib_api__WEBPACK_IMPORTED_MODULE_2__[\"default\"].post(\"/auth/login\", {\n                email,\n                password\n            });\n            if (res.success && res.user) {\n                setUser(res.user);\n                localStorage.setItem(\"user\", JSON.stringify(res.user)); // ✅ persist\n                return {\n                    ok: true,\n                    user: res.user\n                };\n            } else {\n                return {\n                    ok: false,\n                    error: res.message || \"Invalid credentials\"\n                };\n            }\n        } catch (err) {\n            return {\n                ok: false,\n                error: err?.message || \"Login failed\"\n            };\n        }\n    }\n    // Logout\n    function logout() {\n        setUser(null);\n        localStorage.removeItem(\"user\"); // ✅ clear\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            login,\n            logout,\n            loading\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\sonal\\\\Videos\\\\shreeva\\\\shreeva-dashboard\\\\components\\\\AuthProvider.jsx\",\n        lineNumber: 43,\n        columnNumber: 5\n    }, this);\n}\nfunction useAuth() {\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0F1dGhQcm92aWRlci5qc3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLDhCQUE4Qjs7QUFDeUM7QUFDMUM7QUFFN0IsTUFBTUssNEJBQWNMLG9EQUFhQTtBQUVsQixTQUFTTSxhQUFhLEVBQUVDLFFBQVEsRUFBRTtJQUMvQyxNQUFNLENBQUNDLE1BQU1DLFFBQVEsR0FBR1AsK0NBQVFBLENBQUM7SUFDakMsTUFBTSxDQUFDUSxTQUFTQyxXQUFXLEdBQUdULCtDQUFRQSxDQUFDO0lBRXZDLHVDQUF1QztJQUN2Q0MsZ0RBQVNBLENBQUM7UUFDUixNQUFNUyxZQUFZQyxhQUFhQyxPQUFPLENBQUM7UUFDdkMsSUFBSUYsV0FBVztZQUNiSCxRQUFRTSxLQUFLQyxLQUFLLENBQUNKO1FBQ3JCO1FBQ0FELFdBQVc7SUFDYixHQUFHLEVBQUU7SUFFTCxpQkFBaUI7SUFDakIsZUFBZU0sTUFBTSxFQUFFQyxLQUFLLEVBQUVDLFFBQVEsRUFBRTtRQUN0QyxJQUFJO1lBQ0YsTUFBTUMsTUFBTSxNQUFNaEIscURBQVEsQ0FBQyxlQUFlO2dCQUFFYztnQkFBT0M7WUFBUztZQUM1RCxJQUFJQyxJQUFJRSxPQUFPLElBQUlGLElBQUlaLElBQUksRUFBRTtnQkFDM0JDLFFBQVFXLElBQUlaLElBQUk7Z0JBQ2hCSyxhQUFhVSxPQUFPLENBQUMsUUFBUVIsS0FBS1MsU0FBUyxDQUFDSixJQUFJWixJQUFJLElBQUksWUFBWTtnQkFDcEUsT0FBTztvQkFBRWlCLElBQUk7b0JBQU1qQixNQUFNWSxJQUFJWixJQUFJO2dCQUFDO1lBQ3BDLE9BQU87Z0JBQ0wsT0FBTztvQkFBRWlCLElBQUk7b0JBQU9DLE9BQU9OLElBQUlPLE9BQU8sSUFBSTtnQkFBc0I7WUFDbEU7UUFDRixFQUFFLE9BQU9DLEtBQUs7WUFDWixPQUFPO2dCQUFFSCxJQUFJO2dCQUFPQyxPQUFPRSxLQUFLRCxXQUFXO1lBQWU7UUFDNUQ7SUFDRjtJQUVBLFNBQVM7SUFDVCxTQUFTRTtRQUNQcEIsUUFBUTtRQUNSSSxhQUFhaUIsVUFBVSxDQUFDLFNBQVMsVUFBVTtJQUM3QztJQUVBLHFCQUNFLDhEQUFDekIsWUFBWTBCLFFBQVE7UUFBQ0MsT0FBTztZQUFFeEI7WUFBTVM7WUFBT1k7WUFBUW5CO1FBQVE7a0JBQ3pESDs7Ozs7O0FBR1A7QUFFTyxTQUFTMEI7SUFDZCxPQUFPaEMsaURBQVVBLENBQUNJO0FBQ3BCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hyZWV2YS1kYXNoYm9hcmQvLi9jb21wb25lbnRzL0F1dGhQcm92aWRlci5qc3g/M2EzMyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb21wb25lbnRzL0F1dGhQcm92aWRlci5qc3hcclxuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGFwaSBmcm9tICcuLi9saWIvYXBpJztcclxuXHJcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHsgY2hpbGRyZW4gfSkge1xyXG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG5cclxuICAvLyBMb2FkIHVzZXIgZnJvbSBsb2NhbFN0b3JhZ2Ugb24gbW91bnRcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3Qgc2F2ZWRVc2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcclxuICAgIGlmIChzYXZlZFVzZXIpIHtcclxuICAgICAgc2V0VXNlcihKU09OLnBhcnNlKHNhdmVkVXNlcikpO1xyXG4gICAgfVxyXG4gICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgfSwgW10pO1xyXG5cclxuICAvLyBMb2dpbiBBUEkgY2FsbFxyXG4gIGFzeW5jIGZ1bmN0aW9uIGxvZ2luKHsgZW1haWwsIHBhc3N3b3JkIH0pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5wb3N0KCcvYXV0aC9sb2dpbicsIHsgZW1haWwsIHBhc3N3b3JkIH0pO1xyXG4gICAgICBpZiAocmVzLnN1Y2Nlc3MgJiYgcmVzLnVzZXIpIHtcclxuICAgICAgICBzZXRVc2VyKHJlcy51c2VyKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIEpTT04uc3RyaW5naWZ5KHJlcy51c2VyKSk7IC8vIOKchSBwZXJzaXN0XHJcbiAgICAgICAgcmV0dXJuIHsgb2s6IHRydWUsIHVzZXI6IHJlcy51c2VyIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogcmVzLm1lc3NhZ2UgfHwgJ0ludmFsaWQgY3JlZGVudGlhbHMnIH07XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiBlcnI/Lm1lc3NhZ2UgfHwgJ0xvZ2luIGZhaWxlZCcgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIExvZ291dFxyXG4gIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICAgIHNldFVzZXIobnVsbCk7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlcicpOyAvLyDinIUgY2xlYXJcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgdXNlciwgbG9naW4sIGxvZ291dCwgbG9hZGluZyB9fT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aCgpIHtcclxuICByZXR1cm4gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJhcGkiLCJBdXRoQ29udGV4dCIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwidXNlciIsInNldFVzZXIiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsInNhdmVkVXNlciIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJsb2dpbiIsImVtYWlsIiwicGFzc3dvcmQiLCJyZXMiLCJwb3N0Iiwic3VjY2VzcyIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJvayIsImVycm9yIiwibWVzc2FnZSIsImVyciIsImxvZ291dCIsInJlbW92ZUl0ZW0iLCJQcm92aWRlciIsInZhbHVlIiwidXNlQXV0aCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/AuthProvider.jsx\n");

/***/ }),

/***/ "./lib/api.js":
/*!********************!*\
  !*** ./lib/api.js ***!
  \********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);\naxios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst API_BASE = \"http://localhost:5000/api/v1\" || 0;\nconst api = axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create({\n    baseURL: API_BASE,\n    withCredentials: true\n});\napi.interceptors.response.use((res)=>res.data, (err)=>Promise.reject(err.response?.data || err));\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (api);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvYXBpLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQTBCO0FBRTFCLE1BQU1DLFdBQVdDLDhCQUFnQyxJQUFJO0FBRXJELE1BQU1HLE1BQU1MLG9EQUFZLENBQUM7SUFBRU8sU0FBU047SUFBVU8saUJBQWlCO0FBQUs7QUFFcEVILElBQUlJLFlBQVksQ0FBQ0MsUUFBUSxDQUFDQyxHQUFHLENBQzNCLENBQUNDLE1BQVFBLElBQUlDLElBQUksRUFDakIsQ0FBQ0MsTUFBUUMsUUFBUUMsTUFBTSxDQUFDRixJQUFJSixRQUFRLEVBQUVHLFFBQVFDO0FBR2hELGlFQUFlVCxHQUFHQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hyZWV2YS1kYXNoYm9hcmQvLi9saWIvYXBpLmpzPzQ1NDIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuXHJcbmNvbnN0IEFQSV9CQVNFID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX0JBU0UgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9hcGkvdjEnO1xyXG5cclxuY29uc3QgYXBpID0gYXhpb3MuY3JlYXRlKHsgYmFzZVVSTDogQVBJX0JBU0UsIHdpdGhDcmVkZW50aWFsczogdHJ1ZSB9KTtcclxuXHJcbmFwaS5pbnRlcmNlcHRvcnMucmVzcG9uc2UudXNlKFxyXG4gIChyZXMpID0+IHJlcy5kYXRhLFxyXG4gIChlcnIpID0+IFByb21pc2UucmVqZWN0KGVyci5yZXNwb25zZT8uZGF0YSB8fCBlcnIpXHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhcGk7Il0sIm5hbWVzIjpbImF4aW9zIiwiQVBJX0JBU0UiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfQVBJX0JBU0UiLCJhcGkiLCJjcmVhdGUiLCJiYXNlVVJMIiwid2l0aENyZWRlbnRpYWxzIiwiaW50ZXJjZXB0b3JzIiwicmVzcG9uc2UiLCJ1c2UiLCJyZXMiLCJkYXRhIiwiZXJyIiwiUHJvbWlzZSIsInJlamVjdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/api.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_AuthProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/AuthProvider */ \"./components/AuthProvider.jsx\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-toastify */ \"react-toastify\");\n/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-toastify/dist/ReactToastify.css */ \"./node_modules/react-toastify/dist/ReactToastify.css\");\n/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_6__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_AuthProvider__WEBPACK_IMPORTED_MODULE_2__, react_toastify__WEBPACK_IMPORTED_MODULE_5__]);\n([_components_AuthProvider__WEBPACK_IMPORTED_MODULE_2__, react_toastify__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n// pages/_app.js\n\n\n\n\n\n\n\nfunction AppWrapper({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_AuthProvider__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_toastify__WEBPACK_IMPORTED_MODULE_5__.ToastContainer, {\n                position: \"top-right\",\n                autoClose: 3000,\n                hideProgressBar: false,\n                newestOnTop: true,\n                closeOnClick: true,\n                pauseOnHover: true,\n                draggable: true,\n                theme: \"light\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\sonal\\\\Videos\\\\shreeva\\\\shreeva-dashboard\\\\pages\\\\_app.js\",\n                lineNumber: 13,\n                columnNumber: 9\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(RouteGuard, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\sonal\\\\Videos\\\\shreeva\\\\shreeva-dashboard\\\\pages\\\\_app.js\",\n                    lineNumber: 24,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\sonal\\\\Videos\\\\shreeva\\\\shreeva-dashboard\\\\pages\\\\_app.js\",\n                lineNumber: 23,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\sonal\\\\Videos\\\\shreeva\\\\shreeva-dashboard\\\\pages\\\\_app.js\",\n        lineNumber: 12,\n        columnNumber: 5\n    }, this);\n}\nfunction RouteGuard({ children }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    const { user, loading } = (0,_components_AuthProvider__WEBPACK_IMPORTED_MODULE_2__.useAuth)();\n    // Protect admin routes but exclude the admin login page\n    const isAdminRoute = router.pathname.startsWith(\"/admin\") && router.pathname !== \"/admin/login\";\n    (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(()=>{\n        if (!isAdminRoute) return;\n        if (loading) return;\n        if (!user) router.replace(\"/admin/login\"); // redirect to admin login\n    }, [\n        isAdminRoute,\n        user,\n        loading,\n        router\n    ]);\n    if (isAdminRoute && loading) return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        style: {\n            padding: 20\n        },\n        children: \"Checking authentication...\"\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\sonal\\\\Videos\\\\shreeva\\\\shreeva-dashboard\\\\pages\\\\_app.js\",\n        lineNumber: 43,\n        columnNumber: 39\n    }, this);\n    return children;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AppWrapper);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnQkFBZ0I7O0FBQ2U7QUFDb0M7QUFDM0I7QUFDTjtBQUNjO0FBQ0Q7QUFHL0MsU0FBU0ssV0FBVyxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUMxQyxxQkFDRSw4REFBQ1AsZ0VBQVlBOzswQkFDVCw4REFBQ0ksMERBQWNBO2dCQUNmSSxVQUFTO2dCQUNUQyxXQUFXO2dCQUNYQyxpQkFBaUI7Z0JBQ2pCQyxXQUFXO2dCQUNYQyxZQUFZO2dCQUNaQyxZQUFZO2dCQUNaQyxTQUFTO2dCQUNUQyxPQUFNOzs7Ozs7MEJBRVIsOERBQUNDOzBCQUNDLDRFQUFDVjtvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7OztBQUloQztBQUVBLFNBQVNTLFdBQVcsRUFBRUMsUUFBUSxFQUFFO0lBQzlCLE1BQU1DLFNBQVNoQixzREFBU0E7SUFDeEIsTUFBTSxFQUFFaUIsSUFBSSxFQUFFQyxPQUFPLEVBQUUsR0FBR25CLGlFQUFPQTtJQUVqQyx3REFBd0Q7SUFDeEQsTUFBTW9CLGVBQWVILE9BQU9JLFFBQVEsQ0FBQ0MsVUFBVSxDQUFDLGFBQWFMLE9BQU9JLFFBQVEsS0FBSztJQUVqRm5CLGdEQUFTQSxDQUFDO1FBQ1IsSUFBSSxDQUFDa0IsY0FBYztRQUNuQixJQUFJRCxTQUFTO1FBQ2IsSUFBSSxDQUFDRCxNQUFNRCxPQUFPTSxPQUFPLENBQUMsaUJBQWlCLDBCQUEwQjtJQUN2RSxHQUFHO1FBQUNIO1FBQWNGO1FBQU1DO1FBQVNGO0tBQU87SUFFeEMsSUFBSUcsZ0JBQWdCRCxTQUFTLHFCQUFPLDhEQUFDSztRQUFJQyxPQUFPO1lBQUVDLFNBQVM7UUFBRztrQkFBRzs7Ozs7O0lBRWpFLE9BQU9WO0FBQ1Q7QUFFQSxpRUFBZVosVUFBVUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NocmVldmEtZGFzaGJvYXJkLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHBhZ2VzL19hcHAuanNcclxuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5pbXBvcnQgQXV0aFByb3ZpZGVyLCB7IHVzZUF1dGggfSBmcm9tICcuLi9jb21wb25lbnRzL0F1dGhQcm92aWRlcic7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBUb2FzdENvbnRhaW5lciB9IGZyb20gJ3JlYWN0LXRvYXN0aWZ5JztcclxuaW1wb3J0ICdyZWFjdC10b2FzdGlmeS9kaXN0L1JlYWN0VG9hc3RpZnkuY3NzJztcclxuXHJcblxyXG5mdW5jdGlvbiBBcHBXcmFwcGVyKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aFByb3ZpZGVyPlxyXG4gICAgICAgIDxUb2FzdENvbnRhaW5lclxyXG4gICAgICAgIHBvc2l0aW9uPVwidG9wLXJpZ2h0XCJcclxuICAgICAgICBhdXRvQ2xvc2U9ezMwMDB9XHJcbiAgICAgICAgaGlkZVByb2dyZXNzQmFyPXtmYWxzZX1cclxuICAgICAgICBuZXdlc3RPblRvcFxyXG4gICAgICAgIGNsb3NlT25DbGlja1xyXG4gICAgICAgIHBhdXNlT25Ib3ZlclxyXG4gICAgICAgIGRyYWdnYWJsZVxyXG4gICAgICAgIHRoZW1lPVwibGlnaHRcIlxyXG4gICAgICAvPlxyXG4gICAgICA8Um91dGVHdWFyZD5cclxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICAgIDwvUm91dGVHdWFyZD5cclxuICAgIDwvQXV0aFByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJvdXRlR3VhcmQoeyBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcbiAgY29uc3QgeyB1c2VyLCBsb2FkaW5nIH0gPSB1c2VBdXRoKCk7XHJcblxyXG4gIC8vIFByb3RlY3QgYWRtaW4gcm91dGVzIGJ1dCBleGNsdWRlIHRoZSBhZG1pbiBsb2dpbiBwYWdlXHJcbiAgY29uc3QgaXNBZG1pblJvdXRlID0gcm91dGVyLnBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9hZG1pbicpICYmIHJvdXRlci5wYXRobmFtZSAhPT0gJy9hZG1pbi9sb2dpbic7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIWlzQWRtaW5Sb3V0ZSkgcmV0dXJuO1xyXG4gICAgaWYgKGxvYWRpbmcpIHJldHVybjtcclxuICAgIGlmICghdXNlcikgcm91dGVyLnJlcGxhY2UoJy9hZG1pbi9sb2dpbicpOyAvLyByZWRpcmVjdCB0byBhZG1pbiBsb2dpblxyXG4gIH0sIFtpc0FkbWluUm91dGUsIHVzZXIsIGxvYWRpbmcsIHJvdXRlcl0pO1xyXG5cclxuICBpZiAoaXNBZG1pblJvdXRlICYmIGxvYWRpbmcpIHJldHVybiA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IDIwIH19PkNoZWNraW5nIGF1dGhlbnRpY2F0aW9uLi4uPC9kaXY+O1xyXG5cclxuICByZXR1cm4gY2hpbGRyZW47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFwcFdyYXBwZXI7XHJcbiJdLCJuYW1lcyI6WyJBdXRoUHJvdmlkZXIiLCJ1c2VBdXRoIiwidXNlUm91dGVyIiwidXNlRWZmZWN0IiwiVG9hc3RDb250YWluZXIiLCJBcHBXcmFwcGVyIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwicG9zaXRpb24iLCJhdXRvQ2xvc2UiLCJoaWRlUHJvZ3Jlc3NCYXIiLCJuZXdlc3RPblRvcCIsImNsb3NlT25DbGljayIsInBhdXNlT25Ib3ZlciIsImRyYWdnYWJsZSIsInRoZW1lIiwiUm91dGVHdWFyZCIsImNoaWxkcmVuIiwicm91dGVyIiwidXNlciIsImxvYWRpbmciLCJpc0FkbWluUm91dGUiLCJwYXRobmFtZSIsInN0YXJ0c1dpdGgiLCJyZXBsYWNlIiwiZGl2Iiwic3R5bGUiLCJwYWRkaW5nIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ }),

/***/ "react-toastify":
/*!*********************************!*\
  !*** external "react-toastify" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = import("react-toastify");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc","vendor-chunks/react-toastify"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();