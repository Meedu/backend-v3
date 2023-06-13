import moment from "moment";
declare const window: any;

export function getToken(): string {
  return window.localStorage.getItem("meedu-admin-token") || "";
}

export function setToken(token: string) {
  window.localStorage.setItem("meedu-admin-token", token);
}

export function clearToken() {
  window.localStorage.removeItem("meedu-admin-token");
}

export function dateFormat(dateStr: string) {
  if (!dateStr) {
    return "";
  }
  return moment(dateStr).format("YYYY-MM-DD HH:mm");
}

export function dateWholeFormat(dateStr: string) {
  if (!dateStr) {
    return "";
  }
  return moment(dateStr).format("YYYY-MM-DD HH:mm:ss");
}

export function yearFormat(dateStr: string) {
  if (!dateStr) {
    return "";
  }
  return moment(dateStr).format("YYYY-MM-DD");
}

export function generateUUID(): string {
  let guid = "";
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if (i === 8 || i === 12 || i === 16 || i === 20) guid += "-";
  }
  return guid;
}

export function transformBase64ToBlob(
  base64: string,
  mime: string,
  filename: string
): File {
  const arr = base64.split(",");
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function getHost() {
  return window.location.protocol + "//" + window.location.host + "/";
}

export function inStrArray(array: string[], value: string): boolean {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
}

export function checkUrl(value: any) {
  let url = value;
  let str = url.substr(url.length - 1, 1);
  if (str !== "/") {
    url = url + "/";
  }
  return url;
}

export function passwordRules(value: any) {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{12,25}$/;
  let result = re.test(value);
  if (!result) {
    return "密码至少包含大写字母，小写字母，数字，且不少于12位";
  }
}

export function getUrl() {
  return window.location.protocol + "//" + window.location.host;
}

export function saveEditorKey(key: string) {
  window.localStorage.setItem("meedu-editor-key", key);
}

export function getEditorKey() {
  return window.localStorage.getItem("meedu-editor-key");
}

export function codeRender(el: any) {
  if (!el) {
    return;
  }
  let blocks = el.querySelectorAll("pre") || el.querySelectorAll("code");
  blocks.forEach((block: any) => {
    window.hljs.highlightBlock(block);
  });
  return el;
}

export function latexRender(el: any) {
  if (!el) {
    return;
  }
  var reg1 = new RegExp("&nbsp;", "g");
  var reg2 = new RegExp("&amp;", "g");
  var reg3 = new RegExp("nbsp;", "g");
  var reg4 = new RegExp("amp;", "g");
  el.innerHTML = el.innerHTML.replace(reg1, "");
  el.innerHTML = el.innerHTML.replace(reg2, "&");
  el.innerHTML = el.innerHTML.replace(reg3, "");
  el.innerHTML = el.innerHTML.replace(reg4, "");
  window.renderMathInElement(el, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    macros: {
      "\\ge": "\\geqslant",
      "\\le": "\\leqslant",
      "\\geq": "\\geqslant",
      "\\leq": "\\leqslant",
    },
    options: {
      skipHtmlTags: ["noscript", "style", "textarea", "pre", "code"],
      // 跳过mathjax处理的元素的类名，任何元素指定一个类 tex2jax_ignore 将被跳过，多个累=类名'class1|class2'
      ignoreHtmlClass: "tex2jax_ignore",
    },
    svg: {
      fontCache: "global",
    },
    throwOnError: false,
  });

  return el;
}
