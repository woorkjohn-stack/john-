import React, { useState } from 'react';
import { Question } from '../types';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface ManualCreatorProps {
  onAddQuestion: (question: Question) => void;
}

const ManualCreator: React.FC<ManualCreatorProps> = ({ onAddQuestion }) => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState<number>(0);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || options.some(opt => !opt.trim())) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text,
      options,
      correctAnswerIndex: correctIndex,
    };

    onAddQuestion(newQuestion);
    
    // Reset form
    setText('');
    setOptions(['', '', '', '']);
    setCorrectIndex(0);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" />
        إضافة سؤال يدوياً
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نص السؤال</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="اكتب السؤال هنا..."
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">الخيارات (حدد الإجابة الصحيحة)</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCorrectIndex(index)}
                className={`flex-shrink-0 transition-colors ${
                  correctIndex === index ? 'text-green-600' : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                {correctIndex === index ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                  correctIndex === index ? 'border-green-300 bg-green-50' : 'border-gray-300'
                }`}
                placeholder={`الخيار ${index + 1}`}
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <Plus className="w-5 h-5" />
          إضافة السؤال للاختبار
        </button>
      </form>
    </div>
  );
};

export default ManualCreator;
