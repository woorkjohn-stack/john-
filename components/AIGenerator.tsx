import React, { useState } from 'react';
import { Question, Difficulty } from '../types';
import { generateQuestions } from '../services/geminiService';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface AIGeneratorProps {
  onQuestionsGenerated: (questions: Question[]) => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ onQuestionsGenerated }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const questions = await generateQuestions(topic, count, difficulty);
      onQuestionsGenerated(questions);
    } catch (err: any) {
      setError(err.message || 'فشل التوليد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
      <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        توليد أسئلة بالذكاء الاصطناعي
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">موضوع الاختبار</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="مثال: قواعد اللغة العربية، تاريخ مصر، الفيزياء النووية..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأسئلة</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {[3, 5, 10, 15, 20].map(n => (
                <option key={n} value={n}>{n} أسئلة</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مستوى الصعوبة</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {Object.values(Difficulty).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              توليد الاختبار
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIGenerator;
