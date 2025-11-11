function supportsSessionStorage() {
  try {
    sessionStorage.setItem('_t', '1');
    sessionStorage.removeItem('_t');
    return true;
  } catch (e) {
    return false;
  }
}

function setCookie(name, val, secs) {
  document.cookie = name + "=" + val + "; path=/; max-age=" + (secs || 7200);
}

function getCookie(name) {
  const found = document.cookie.split('; ').find(r => r.startsWith(name + '='));
  return found ? found.split('=')[1] : null;
}

(function init() {
  const path = location.pathname;
  const isIndex = path === "/" || path.endsWith("/index.html") || path.endsWith("/");
  const isMoabt = path.includes("/moabt/");
  const ssOK = supportsSessionStorage();
  const usedSS = ssOK && sessionStorage.getItem("moabtUsed") === "1";
  const usedCookie = !ssOK && getCookie("moabtUsed") === "1";
  const used = usedSS || usedCookie || location.search.includes("v=clean");

  if (isIndex) {
    const anchors = document.querySelectorAll('a[data-slug]');
    anchors.forEach(a => {
      const slug = a.getAttribute('data-slug');
      const target = (used ? "clean/" : "moabt/") + slug + ".html";
      a.setAttribute("href", target);
    });
    return;
  }

  if (isMoabt) {
    // First-time MOABT visit sets state; otherwise redirect to clean
    if (!used) {
      if (ssOK) {
        sessionStorage.setItem("moabtUsed", "1");
      } else {
        setCookie("moabtUsed", "1", 7200);
      }
      return; // allow viewing MOABT once
    } else {
      const slug = path.split('/').pop(); // aN.html
      const cleanURL = "../clean/" + slug + (ssOK ? "" : "?v=clean");
      location.replace(cleanURL);
      return;
    }
  }
})();