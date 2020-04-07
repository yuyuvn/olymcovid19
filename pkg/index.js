import { __cargo_web_snippet_80d6d56760c65e49b7be8b6b01c1ea861b046bf0 } from './snippets/stdweb-bb142200b065bd55/inline330.js';
import { __cargo_web_snippet_e9638d6405ab65f78daf4a5af9c9de14ecf1e2ec } from './snippets/stdweb-bb142200b065bd55/inline42.js';
import { wasm_bindgen_initialize } from './snippets/stdweb-bb142200b065bd55/inline45.js';
import { __cargo_web_snippet_72fc447820458c720c68d0d8e078ede631edd723 } from './snippets/stdweb-bb142200b065bd55/inline557.js';
import { __cargo_web_snippet_97495987af1720d8a9a923fa4683a7b683e3acd6 } from './snippets/stdweb-bb142200b065bd55/inline558.js';
import { __cargo_web_snippet_dc2fd915bd92f9e9c6a3bd15174f1414eee3dbaf } from './snippets/stdweb-bb142200b065bd55/inline559.js';
import { __cargo_web_snippet_1c30acb32a1994a07c75e804ae9855b43f191d63 } from './snippets/stdweb-bb142200b065bd55/inline560.js';
import { __cargo_web_snippet_4fd31c9e56d40b8642cf9e6f96fd6b570f355cea } from './snippets/web_logger-831cf3115fc27a05/inline0.js';
import { __cargo_web_snippet_114b518968fda2247f8d0d6ad5a226d35aa55986 } from './snippets/web_logger-831cf3115fc27a05/inline1.js';
import { __cargo_web_snippet_c5c1b47195f246fcd2672c546e8c4d526e328687 } from './snippets/web_logger-831cf3115fc27a05/inline2.js';
import { __cargo_web_snippet_6bcfdb0f4808b0b1e8b8b8d2facd39b73ac5018b } from './snippets/web_logger-831cf3115fc27a05/inline3.js';
import { __cargo_web_snippet_199d5eb25dfe761687bcd487578eb7e636bd9650 } from './snippets/web_logger-831cf3115fc27a05/inline4.js';
import * as wasm from './index_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? require('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? require('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) wasm.__wbindgen_export_2.get(dtor)(a, state.b);
            else state.a = a;
        }
    };
    real.original = state;
    return real;
}
function __wbg_adapter_28(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hac087ec3d6c572c3(arg0, arg1, addHeapObject(arg2));
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(dtor)(state.a, state.b);
                state.a = 0;
            }
        }
    };
    real.original = state;
    return real;
}
function __wbg_adapter_31(arg0, arg1, arg2, arg3) {
    wasm._dyn_core__ops__function__Fn__A__B___Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hb2f17acf360cccec(arg0, arg1, arg2, arg3);
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
function __wbg_adapter_34(arg0, arg1, arg2) {
    try {
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h960da298e2251570(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_37(arg0, arg1, arg2) {
    var ret = wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbe9829760191cbe0(arg0, arg1, arg2);
    return ret;
}

/**
*/
export function run_app() {
    wasm.run_app();
}

function handleError(e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
}

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

export const __wbg_cargowebsnippet4fd31c9e56d40b8642cf9e6f96fd6b570f355cea_8a401aade62618ba = function(arg0, arg1) {
    __cargo_web_snippet_4fd31c9e56d40b8642cf9e6f96fd6b570f355cea(takeObject(arg0), arg1);
};

export const __wbg_cargowebsnippet199d5eb25dfe761687bcd487578eb7e636bd9650_cab2de567628901e = function(arg0, arg1) {
    __cargo_web_snippet_199d5eb25dfe761687bcd487578eb7e636bd9650(takeObject(arg0), arg1);
};

export const __wbg_cargowebsnippet6bcfdb0f4808b0b1e8b8b8d2facd39b73ac5018b_2b46a18b54b44834 = function(arg0, arg1) {
    __cargo_web_snippet_6bcfdb0f4808b0b1e8b8b8d2facd39b73ac5018b(takeObject(arg0), arg1);
};

export const __wbg_cargowebsnippetc5c1b47195f246fcd2672c546e8c4d526e328687_8e9bf2760a8d405c = function(arg0, arg1) {
    __cargo_web_snippet_c5c1b47195f246fcd2672c546e8c4d526e328687(takeObject(arg0), arg1);
};

export const __wbg_cargowebsnippet114b518968fda2247f8d0d6ad5a226d35aa55986_90291b06311b4650 = function(arg0, arg1) {
    __cargo_web_snippet_114b518968fda2247f8d0d6ad5a226d35aa55986(takeObject(arg0), arg1);
};

export const __wbindgen_object_clone_ref = function(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

export const __wbg_cargowebsnippet80d6d56760c65e49b7be8b6b01c1ea861b046bf0_5a8953894b8affd6 = function(arg0, arg1) {
    __cargo_web_snippet_80d6d56760c65e49b7be8b6b01c1ea861b046bf0(takeObject(arg0), arg1);
};

export const __wbg_cargowebsnippete9638d6405ab65f78daf4a5af9c9de14ecf1e2ec_ad1e81894f802539 = function(arg0, arg1) {
    __cargo_web_snippet_e9638d6405ab65f78daf4a5af9c9de14ecf1e2ec(takeObject(arg0), arg1);
};

export const __wbg_wasmbindgeninitialize_c1c4df6b494511ad = function(arg0, arg1, arg2, arg3) {
    var ret = wasm_bindgen_initialize(takeObject(arg0), takeObject(arg1), getObject(arg2), getObject(arg3));
    return addHeapObject(ret);
};

export const __wbindgen_cb_forget = function(arg0) {
    takeObject(arg0);
};

export const __wbg_cargowebsnippet1c30acb32a1994a07c75e804ae9855b43f191d63_6d353463ef525961 = function(arg0) {
    __cargo_web_snippet_1c30acb32a1994a07c75e804ae9855b43f191d63(takeObject(arg0));
};

export const __wbg_cargowebsnippetdc2fd915bd92f9e9c6a3bd15174f1414eee3dbaf_ce5c721cab10d020 = function(arg0) {
    __cargo_web_snippet_dc2fd915bd92f9e9c6a3bd15174f1414eee3dbaf(takeObject(arg0));
};

export const __wbg_cargowebsnippet97495987af1720d8a9a923fa4683a7b683e3acd6_a438202dc16f44c0 = function(arg0, arg1, arg2) {
    __cargo_web_snippet_97495987af1720d8a9a923fa4683a7b683e3acd6(takeObject(arg0), arg1, arg2);
};

export const __wbg_cargowebsnippet72fc447820458c720c68d0d8e078ede631edd723_ece3da0a4474dbeb = function(arg0, arg1, arg2, arg3) {
    __cargo_web_snippet_72fc447820458c720c68d0d8e078ede631edd723(takeObject(arg0), arg1, arg2, arg3);
};

export const __wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbg_Window_63ea798bda772143 = function(arg0) {
    var ret = getObject(arg0).Window;
    return addHeapObject(ret);
};

export const __wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export const __wbg_WorkerGlobalScope_cf778d0287a47728 = function(arg0) {
    var ret = getObject(arg0).WorkerGlobalScope;
    return addHeapObject(ret);
};

export const __wbg_new_59cb74e423758ede = function() {
    var ret = new Error();
    return addHeapObject(ret);
};

export const __wbg_stack_558ba5917b466edd = function(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

export const __wbg_instanceof_Window_a633dbe0900c728a = function(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
};

export const __wbg_document_07444f1bbea314bb = function(arg0) {
    var ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_localStorage_48f33617aec46f3f = function(arg0) {
    try {
        var ret = getObject(arg0).localStorage;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_sessionStorage_67ea281dd07d8438 = function(arg0) {
    try {
        var ret = getObject(arg0).sessionStorage;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_fetch_418ccd327dc144c7 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).fetch(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export const __wbg_createElement_5a267cb074dc073b = function(arg0, arg1, arg2) {
    try {
        var ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_createElementNS_6dd6bfc8ad570e2a = function(arg0, arg1, arg2, arg3, arg4) {
    try {
        var ret = getObject(arg0).createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_createTextNode_b131e8421d578817 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).createTextNode(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
};

export const __wbg_querySelector_2dabb5b08003bfad = function(arg0, arg1, arg2) {
    try {
        var ret = getObject(arg0).querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_instanceof_HtmlTextAreaElement_a07fcbfd18542e06 = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLTextAreaElement;
    return ret;
};

export const __wbg_value_57c725aca44d9296 = function(arg0, arg1, arg2) {
    getObject(arg0).value = getStringFromWasm0(arg1, arg2);
};

export const __wbg_newwithstrandinit_80e5800985bdc350 = function(arg0, arg1, arg2) {
    try {
        var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_instanceof_HtmlInputElement_5f61a3d2d3d02410 = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLInputElement;
    return ret;
};

export const __wbg_checked_8f4b67dbaf90811e = function(arg0, arg1) {
    getObject(arg0).checked = arg1 !== 0;
};

export const __wbg_type_5b3d3d8807847d57 = function(arg0, arg1, arg2) {
    getObject(arg0).type = getStringFromWasm0(arg1, arg2);
};

export const __wbg_value_ce3b7a6a03d76643 = function(arg0, arg1, arg2) {
    getObject(arg0).value = getStringFromWasm0(arg1, arg2);
};

export const __wbg_signal_3deab6786ea92938 = function(arg0) {
    var ret = getObject(arg0).signal;
    return addHeapObject(ret);
};

export const __wbg_new_377197386a4a8faf = function() {
    try {
        var ret = new AbortController();
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_abort_0e465742db5609db = function(arg0) {
    getObject(arg0).abort();
};

export const __wbg_addEventListener_91aeb4a2a4221f90 = function(arg0, arg1, arg2, arg3, arg4) {
    try {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_removeEventListener_e6d1dae0854e625e = function(arg0, arg1, arg2, arg3, arg4) {
    try {
        getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), arg4 !== 0);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_stopPropagation_61518782238c8a3c = function(arg0) {
    getObject(arg0).stopPropagation();
};

export const __wbg_lastChild_a7e588170b940ea7 = function(arg0) {
    var ret = getObject(arg0).lastChild;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_nextSibling_a89e92f7f3b94819 = function(arg0) {
    var ret = getObject(arg0).nextSibling;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_nodeValue_f6bcda3acca3e7df = function(arg0, arg1, arg2) {
    getObject(arg0).nodeValue = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
};

export const __wbg_appendChild_c1802f48577b21f6 = function(arg0, arg1) {
    try {
        var ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_insertBefore_f40a70a9913f64f5 = function(arg0, arg1, arg2) {
    try {
        var ret = getObject(arg0).insertBefore(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_removeChild_9a521558bd3fd73e = function(arg0, arg1) {
    try {
        var ret = getObject(arg0).removeChild(getObject(arg1));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_namespaceURI_a890993882ac3334 = function(arg0, arg1) {
    var ret = getObject(arg1).namespaceURI;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_removeAttribute_518c8ed1a02058f8 = function(arg0, arg1, arg2) {
    try {
        getObject(arg0).removeAttribute(getStringFromWasm0(arg1, arg2));
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_setAttribute_3021f1b348fd14a5 = function(arg0, arg1, arg2, arg3, arg4) {
    try {
        getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_fetch_ed33df5e50ed23b1 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).fetch(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export const __wbg_newwithstrsequencesequence_cb61b14a39011a16 = function(arg0) {
    try {
        var ret = new Headers(getObject(arg0));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_status_2efcc6c118058f68 = function(arg0) {
    var ret = getObject(arg0).status;
    return ret;
};

export const __wbg_headers_5dc84838dd997124 = function(arg0) {
    var ret = getObject(arg0).headers;
    return addHeapObject(ret);
};

export const __wbg_arrayBuffer_03e3c2f672961673 = function(arg0) {
    try {
        var ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_text_3dd7e0ea10b9acc2 = function(arg0) {
    try {
        var ret = getObject(arg0).text();
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_get_82c22aeeb618210d = function(arg0, arg1) {
    var ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

export const __wbindgen_is_function = function(arg0) {
    var ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export const __wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export const __wbg_next_3d521c5c088358fa = function(arg0) {
    var ret = getObject(arg0).next;
    return addHeapObject(ret);
};

export const __wbg_next_c08bf57a239475c3 = function(arg0) {
    try {
        var ret = getObject(arg0).next();
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_done_e784c64062606540 = function(arg0) {
    var ret = getObject(arg0).done;
    return ret;
};

export const __wbg_value_11f53ed6202a1367 = function(arg0) {
    var ret = getObject(arg0).value;
    return addHeapObject(ret);
};

export const __wbg_iterator_7ab2f711861ad076 = function() {
    var ret = Symbol.iterator;
    return addHeapObject(ret);
};

export const __wbg_get_8fd175832d82a656 = function(arg0, arg1) {
    try {
        var ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_call_804d3ad7e8acd4d5 = function(arg0, arg1) {
    try {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_new_ec28d6ba821801cb = function() {
    var ret = new Array();
    return addHeapObject(ret);
};

export const __wbg_from_2d3c0ec33c52da20 = function(arg0) {
    var ret = Array.from(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_push_ffaa2df7422d3b4c = function(arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export const __wbg_toString_92399881750beb8f = function(arg0) {
    var ret = getObject(arg0).toString();
    return addHeapObject(ret);
};

export const __wbg_newnoargs_ebdc90c3d1e4e55d = function(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_new_937729a89a522fb5 = function() {
    var ret = new Object();
    return addHeapObject(ret);
};

export const __wbg_resolve_3e5970e9c931a3c2 = function(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_then_d797310661d9e275 = function(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export const __wbg_then_e37e0b9ef0995585 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export const __wbg_globalThis_48a5e9494e623f26 = function() {
    try {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_self_25067cb019cade42 = function() {
    try {
        var ret = self.self;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_window_9e80200b35aa30f8 = function() {
    try {
        var ret = window.window;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_global_7583a634265a91fc = function() {
    try {
        var ret = global.global;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_set_5cbed684ac2b1ce9 = function(arg0, arg1, arg2) {
    try {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    } catch (e) {
        handleError(e)
    }
};

export const __wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

export const __wbindgen_function_table = function() {
    var ret = wasm.__wbindgen_export_2;
    return addHeapObject(ret);
};

export const __wbindgen_closure_wrapper353 = function(arg0, arg1, arg2) {
    var ret = makeClosure(arg0, arg1, 130, __wbg_adapter_31);
    return addHeapObject(ret);
};

export const __wbindgen_closure_wrapper583 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 219, __wbg_adapter_28);
    return addHeapObject(ret);
};

export const __wbindgen_closure_wrapper351 = function(arg0, arg1, arg2) {
    var ret = makeClosure(arg0, arg1, 130, __wbg_adapter_37);
    return addHeapObject(ret);
};

export const __wbindgen_closure_wrapper417 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 150, __wbg_adapter_34);
    return addHeapObject(ret);
};

