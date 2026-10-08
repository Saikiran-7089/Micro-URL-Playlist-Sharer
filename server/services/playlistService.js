import supabase from '../config/supabase.js';
import { generateUniqueCode } from '../utils/generateCode.js';

export const createPlaylist = async (name, urls) => {
  // Generate playlist code
  const playlistCode = await generateUniqueCode('playlists', 'playlist_code', 6, 'PL');

  // We should ideally use a transaction or RPC for this, but since we are limited to the basic Supabase REST API,
  // we will insert the playlist first, then the urls, then the relationships.
  // If anything fails, we will try to clean up, though an RPC function on Supabase would be safer.

  const { data: playlist, error: playlistError } = await supabase
    .from('playlists')
    .insert([{ name, playlist_code: playlistCode }])
    .select()
    .single();

  if (playlistError) {
    throw new Error('Database error while creating playlist');
  }

  // Create short URLs for all
  const urlRecords = [];
  for (const originalUrl of urls) {
    const shortCode = await generateUniqueCode('urls', 'short_code', 6);
    const { data: urlData, error: urlError } = await supabase
      .from('urls')
      .insert([{ original_url: originalUrl, short_code: shortCode }])
      .select()
      .single();
    
    if (urlError) {
      // In a real production app we'd want to rollback everything here
      throw new Error('Database error while creating shortened URLs for playlist');
    }
    urlRecords.push(urlData);
  }

  // Create playlist_urls relations
  const relations = urlRecords.map((urlRecord, index) => ({
    playlist_id: playlist.id,
    url_id: urlRecord.id,
    position: index + 1
  }));

  const { error: relationError } = await supabase
    .from('playlist_urls')
    .insert(relations);

  if (relationError) {
    throw new Error('Database error while creating playlist relationships');
  }

  return {
    playlist,
    totalLinks: urls.length
  };
};

export const getPlaylistByCode = async (playlistCode) => {
  // Fetch playlist
  const { data: playlist, error: playlistError } = await supabase
    .from('playlists')
    .select('*')
    .eq('playlist_code', playlistCode)
    .single();

  if (playlistError && playlistError.code === 'PGRST116') {
    return null;
  }
  
  if (playlistError) {
    throw new Error('Database error while fetching playlist');
  }

  // Fetch urls with positions
  const { data: relations, error: relationsError } = await supabase
    .from('playlist_urls')
    .select(`
      position,
      urls (
        original_url,
        short_code,
        clicks
      )
    `)
    .eq('playlist_id', playlist.id)
    .order('position', { ascending: true });

  if (relationsError) {
    throw new Error('Database error while fetching playlist URLs');
  }

  return {
    playlist,
    links: relations.map(r => ({
      originalUrl: r.urls.original_url,
      shortCode: r.urls.short_code,
      clicks: r.urls.clicks,
      position: r.position
    }))
  };
};
