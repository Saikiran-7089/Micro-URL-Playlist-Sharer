import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, ExternalLink, Calendar, Link as LinkIcon, BarChart3 } from 'lucide-react';
import { getPlaylist } from '../services/api';

const Playlist = () => {
  const { playlistCode } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await getPlaylist(playlistCode);
        if (res.success) {
          setPlaylist(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };

    if (playlistCode) {
      fetchPlaylist();
    }
  }, [playlistCode]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!playlist) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{playlist.name}</h1>
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="flex items-center"><LinkIcon size={16} className="mr-1" /> {playlist.links.length} Links</span>
              <span className="flex items-center"><Calendar size={16} className="mr-1" /> {new Date(playlist.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">
              Code: {playlist.playlistCode}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {playlist.links.map((link) => (
          <div key={link.shortCode} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="bg-gray-100 text-gray-600 font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  {link.position}
                </span>
                <a 
                  href={link.shortUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                >
                  {link.shortUrl} <ExternalLink size={16} className="ml-1" />
                </a>
              </div>
              <button
                onClick={() => handleCopy(link.shortUrl)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Copy Short URL"
              >
                <Copy size={18} />
              </button>
            </div>
            
            <div className="pl-11 space-y-2">
              <div className="text-sm text-gray-600 break-all">
                <span className="font-medium text-gray-700">Original:</span> {link.originalUrl}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <BarChart3 size={16} className="mr-1" />
                <span>{link.clicks} {link.clicks === 1 ? 'click' : 'clicks'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
