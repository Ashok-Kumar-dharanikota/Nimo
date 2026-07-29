export const uploadMediaToSupabase = async (
  uri: string, 
  type: 'photo' | 'video', 
  userId: string
): Promise<string> => {
  // For now, return the local URI. Later this will be stored securely or backed up.
  return uri;
};
