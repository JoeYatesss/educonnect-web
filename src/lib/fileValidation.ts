export type FileType = 'cv' | 'headshot' | 'video';

export interface FileConstraint {
  maxSize: number;
  maxSizeMB: number;
  allowedTypes: string[];
  extensions: string[];
  label: string;
}

export const FILE_CONSTRAINTS: Record<FileType, FileConstraint> = {
  cv: {
    maxSize: 10 * 1024 * 1024, // 10MB
    maxSizeMB: 10,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    extensions: ['.pdf', '.doc', '.docx'],
    label: 'CV/Resume',
  },
  headshot: {
    maxSize: 10 * 1024 * 1024, // 10MB
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png'],
    extensions: ['.jpg', '.jpeg', '.png'],
    label: 'Headshot Photo',
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    maxSizeMB: 100,
    allowedTypes: ['video/mp4', 'video/quicktime'],
    extensions: ['.mp4', '.mov'],
    label: 'Introduction Video',
  },
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File | null | undefined, type: FileType): ValidationResult {
  const constraints = FILE_CONSTRAINTS[type];

  if (!file) {
    return {
      valid: false,
      error: `${constraints.label} is required`,
    };
  }

  // Check file size
  if (file.size > constraints.maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMB}MB). Maximum size is ${constraints.maxSizeMB}MB.`,
    };
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!constraints.extensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file type. Please upload a ${constraints.extensions.join(', ')} file.`,
    };
  }

  // Check MIME type (additional validation)
  if (!constraints.allowedTypes.includes(file.type)) {
    // Some browsers may report different MIME types, so we also accept based on extension
    const extensionToMime: Record<string, string[]> = {
      '.pdf': ['application/pdf'],
      '.doc': ['application/msword'],
      '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      '.jpg': ['image/jpeg'],
      '.jpeg': ['image/jpeg'],
      '.png': ['image/png'],
      '.mp4': ['video/mp4'],
      '.mov': ['video/quicktime'],
    };

    const allowedMimes = extensionToMime[extension] || [];
    if (!allowedMimes.includes(file.type) && file.type !== '') {
      return {
        valid: false,
        error: `Invalid file format. Please upload a valid ${constraints.label.toLowerCase()}.`,
      };
    }
  }

  return { valid: true };
}

export function getFileExtension(file: File): string {
  return file.name.split('.').pop()?.toLowerCase() || '';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
