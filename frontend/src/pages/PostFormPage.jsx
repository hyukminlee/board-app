import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';

function PostFormPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isEdit = params.get('edit') === 'true';
  const id = params.get('id');

  useEffect(() => {
    if (isEdit && id) {
      API.get(`/posts/${id}`).then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
      });
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) formData.append('file', file);

    if (isEdit) {
      await API.put(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      await API.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? '글 수정' : '글쓰기'}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="border p-2"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
          className="border p-2"
          rows="5"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {isEdit ? '수정하기' : '작성하기'}
        </button>
      </form>
    </div>
  );
}

export default PostFormPage;
