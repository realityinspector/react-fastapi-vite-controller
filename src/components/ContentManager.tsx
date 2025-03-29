import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Content {
  id: number;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentManagerProps {
  token: string;
}

const ContentManager: React.FC<ContentManagerProps> = ({ token }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');

  const fetchContents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/content/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContents(response.data);
    } catch (err) {
      setError('Failed to fetch contents');
    }
  };

  useEffect(() => {
    fetchContents();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/content/`,
        { title, body, published },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setBody('');
      setPublished(false);
      fetchContents();
    } catch (err) {
      setError('Failed to create content');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContents();
    } catch (err) {
      setError('Failed to delete content');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Content Manager</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600"
            />
            <span className="ml-2 text-gray-700">Published</span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Content
        </button>
      </form>

      <div className="space-y-4">
        {contents.map((content) => (
          <div
            key={content.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
            <p className="text-gray-600 mb-4">{content.body}</p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {content.published ? 'Published' : 'Draft'} •{' '}
                {new Date(content.created_at).toLocaleDateString()}
              </div>
              <button
                onClick={() => handleDelete(content.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManager; 