const API_BASE_URL = 'http://localhost:3000';

export function getImageUrl(path: any): string {
  if (!path) return '/placeholder.jpg';
  
  // Si nos llega un objeto de Prisma accidentalmente { url: '...' }
  const finalPath = typeof path === 'object' ? path.url : String(path);
  
  if (!finalPath) return '/placeholder.jpg';

  // If it's already a full URL
  if (finalPath.startsWith('http://') || finalPath.startsWith('https://') || finalPath.startsWith('blob:')) {
    return finalPath;
  }
  
  // Ensure the path starts with /
  const normalizedPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;
  
  return `${API_BASE_URL}${normalizedPath}`;
}
