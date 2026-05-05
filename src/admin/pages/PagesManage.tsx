import { useState } from 'react';
import { FileEdit, Save } from 'lucide-react';

const pageSections = [
  { slug: 'home', section: 'hero', title: 'Home Hero', content: 'Welcome to Sehat Medika Hospital', type: 'text' },
  { slug: 'home', section: 'stats', title: 'Home Stats', content: 'Years of Service: 25+, Doctors: 150+, Patients: 500K+, Departments: 20+', type: 'text' },
  { slug: 'about', section: 'mission', title: 'About - Mission', content: 'To provide accessible, high-quality healthcare services with compassion and excellence.', type: 'textarea' },
  { slug: 'about', section: 'vision', title: 'About - Vision', content: 'To be the leading healthcare institution in the region.', type: 'textarea' },
  { slug: 'contact', section: 'info', title: 'Contact Info', content: '123 Health Street, Medika City, MC 12345 | +62 21 5555 0123', type: 'textarea' },
  { slug: 'careers', section: 'hero', title: 'Careers Hero', content: 'Join Our Team - Build your career with us', type: 'text' },
];

const PagesManage = () => {
  const [pages, setPages] = useState(pageSections);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(pages[idx].content);
  };

  const saveEdit = () => {
    if (editingIdx !== null) {
      setPages(prev => prev.map((p, i) => i === editingIdx ? { ...p, content: editValue } : p));
      setEditingIdx(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Pages</h1>
        <p className="text-gray-600 mt-1">Edit static page content</p>
      </div>

      <div className="space-y-4">
        {pages.map((page, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{page.title}</h3>
                <p className="text-xs text-gray-500">Page: {page.slug} | Section: {page.section}</p>
              </div>
              {editingIdx !== idx && (
                <button
                  onClick={() => startEdit(idx)}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FileEdit className="w-4 h-4" />
                </button>
              )}
            </div>

            {editingIdx === idx ? (
              <div>
                {page.type === 'textarea' ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none mb-3"
                  />
                ) : (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none mb-3"
                  />
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingIdx(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">{page.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PagesManage;
