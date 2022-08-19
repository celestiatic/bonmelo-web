
export function openInNewWindow(url:string, { width, height }: { width?: number, height?: number } = { height: 570, width: 520 }):Window {
    const openedWindow = window.open(
      url,
      "_blank",
      `location=yes,height=${height || 570},width=${width || 520},scrollbars=yes,status=no`
    );
    return openedWindow as Window;
}