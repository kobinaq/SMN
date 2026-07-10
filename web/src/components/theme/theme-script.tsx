/** Inline script to prevent theme flash before React hydrates */
export function ThemeScript() {
  const code = `(function(){try{var k='smn-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}var r=document.documentElement;r.classList.toggle('light',t==='light');r.classList.toggle('dark',t==='dark');r.style.colorScheme=t}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
