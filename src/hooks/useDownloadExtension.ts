import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { manifestJson, popupHtml, popupJs, backgroundJs } from '@/lib/extensionFiles';

export const useDownloadExtension = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadExtension = async () => {
    setIsDownloading(true);
    
    try {
      const zip = new JSZip();
      
      // Add text files
      zip.file('manifest.json', manifestJson);
      zip.file('popup.html', popupHtml);
      zip.file('popup.js', popupJs);
      zip.file('background.js', backgroundJs);
      
      // Fetch and add the icon
      const iconResponse = await fetch('/extension/icon.png');
      const iconBlob = await iconResponse.blob();
      zip.file('icon.png', iconBlob);
      
      // Generate ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Download
      saveAs(content, 'Zapdata-Rotator-v4.0.zip');
      
    } catch (error) {
      console.error('Error creating ZIP:', error);
      alert('Erro ao criar o arquivo. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadExtension, isDownloading };
};
