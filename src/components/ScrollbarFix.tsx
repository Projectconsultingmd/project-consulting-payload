import Script from 'next/script'

export function ScrollbarFix() {
  return (
    <Script
      id="scrollbar-fix"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const style = document.createElement('style');
            style.textContent = 'body[data-scroll-locked] { margin-right: 0 !important; }';
            document.head.appendChild(style);
          })();
        `,
      }}
    />
  )
}
