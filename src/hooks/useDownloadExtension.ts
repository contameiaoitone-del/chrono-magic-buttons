import { useState } from 'react';

export const useDownloadExtension = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadExtension = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch('/zapdata-rotator.zip');
      if (!response.ok) throw new Error(`Falha no download: ${response.status}`);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'zapdata-rotator.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar a extensão:', error);
      alert('Erro ao baixar o arquivo. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadExtension, isDownloading };
};
