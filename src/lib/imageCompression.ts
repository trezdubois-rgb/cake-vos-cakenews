import imageCompression from 'browser-image-compression';

interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    ...options,
  };

  try {
    // console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    const compressedFile = await imageCompression(file, defaultOptions);
    // console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
};

export const compressImageFor1080 = async (file: File): Promise<File> => {
  return compressImage(file, {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
    fileType: 'image/jpeg',
  });
};

export const compressImageForVertical = async (file: File): Promise<File> => {
  return compressImage(file, {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  });
};