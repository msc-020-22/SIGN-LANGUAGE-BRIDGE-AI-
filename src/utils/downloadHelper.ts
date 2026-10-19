/**
 * Reliable Client-Side File Downloader
 * Works across sandboxed iframes, mobile browsers, and modern desktop browsers
 */
export async function downloadPackage(
  url: string, 
  filename: string, 
  onProgress?: (status: 'idle' | 'downloading' | 'success' | 'error', message?: string) => void
): Promise<boolean> {
  try {
    if (onProgress) onProgress('downloading', 'Fetching package from server...');

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
    }

    if (onProgress) onProgress('downloading', 'Processing zip archive into memory...');
    const blob = await response.blob();

    if (onProgress) onProgress('downloading', 'Triggering browser download prompt...');
    const blobUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.setAttribute('download', filename);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    anchor.click();

    setTimeout(() => {
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);
    }, 5000);

    if (onProgress) onProgress('success', 'Download initiated successfully!');
    return true;
  } catch (err: any) {
    console.warn('[DownloadHelper] Blob download failed, attempting direct navigation fallback:', err);
    try {
      // Fallback: direct link trigger
      const directAnchor = document.createElement('a');
      directAnchor.href = url;
      directAnchor.setAttribute('download', filename);
      directAnchor.setAttribute('target', '_blank');
      directAnchor.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(directAnchor);
      directAnchor.click();
      setTimeout(() => document.body.removeChild(directAnchor), 1000);

      if (onProgress) onProgress('success', 'Download requested via fallback link.');
      return true;
    } catch (fallbackErr: any) {
      if (onProgress) onProgress('error', err.message || 'Download was blocked by browser sandbox.');
      return false;
    }
  }
}
