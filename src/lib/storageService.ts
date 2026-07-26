import { supabase } from '../utils/supabase';

export const uploadMediaToSupabase = async (
  uri: string, 
  type: 'photo' | 'video', 
  userId: string
): Promise<string> => {
  try {
    // 1. Determine file extension and type
    const uriParts = uri.split('.');
    const ext = uriParts.length > 1 ? uriParts[uriParts.length - 1] : (type === 'video' ? 'mp4' : 'jpg');
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    
    // 2. Fetch the file as a Blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // 3. Upload to Supabase 'media' bucket
    const { data, error } = await supabase
      .storage
      .from('media')
      .upload(fileName, blob, {
        contentType: type === 'video' ? `video/${ext}` : `image/${ext}`,
        upsert: false
      });

    if (error) {
      console.error('[StorageService] Error uploading file to Supabase:', error);
      throw error;
    }

    // 4. Retrieve and return the public URL
    const { data: publicData } = supabase
      .storage
      .from('media')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (err) {
    console.error('[StorageService] Upload Exception:', err);
    throw err;
  }
};
