import React, { useState, useEffect } from 'react';
import { Question, ViewMode } from './types';
import ManualCreator from './components/ManualCreator';
import AIGenerator from './components/AIGenerator';
import QuizTaker from './components/QuizTaker';
import ShareDialog from './components/ShareDialog';
import { parseShareLink } from './services/shareService';
import { BookOpen, PenTool, PlayCircle, Trash2, ListChecks, GraduationCap, Share2, Link as LinkIcon } from 'lucide-react';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [mode, setMode] = useState<ViewMode>('create');
  const [isShareOpen, setIsShareOpen] = useState(false);

  // التحقق من الرابط عند تحميل الصفحة
  useEffect(() => {
    const result = parseShareLink();
    if (result && result.questions.length > 0) {
      setQuestions(result.questions);
      if (result.slug) {
        setQuizTitle(result.slug);
      }
      setMode('take'); // الانتقال مباشرة لوضع الاختبار
      
      // تنظيف الرابط حتى لا يبدو طويلاً جداً للمستخدم (اختياري)
      // window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const addQuestion = (q: Question) => {
    setQuestions(prev => [...prev, q]);
  };

  const addGeneratedQuestions = (qs: Question[]) => {
    setQuestions(prev => [...prev, ...qs]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع الأسئلة؟')) {
      setQuestions([]);
      setQuizTitle('');
      // إزالة معلمات الرابط عند الحذف
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  // Main Render Logic
  return (
    <div className="min-h-screen pb-12">
      <ShareDialog 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        questions={questions} 
      />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md transform rotate-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">مُنشئ الاختبارات الذكي</h1>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
               {questions.length} أسئلة
            </span>
            {questions.length > 0 && (
              <button 
                onClick={() => setIsShareOpen(true)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="نسخ رابط الاختبار"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Navigation Tabs (Only visible when not taking quiz) */}
        {mode !== 'take' && (
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex gap-1">
              <button
                onClick={() => setMode('create')}
                className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                  mode === 'create' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <PenTool className="w-4 h-4" />
                إنشاء أسئلة
              </button>
              <button
                onClick={() => setMode('preview')}
                className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                  mode === 'preview' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ListChecks className="w-4 h-4" />
                مراجعة ({questions.length})
              </button>
            </div>
          </div>
        )}

        {/* CREATE MODE */}
        {mode === 'create' && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <AIGenerator onQuestionsGenerated={addGeneratedQuestions} />
              
              {/* Instructions / Tip */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm leading-relaxed">
                <strong>نصيحة:</strong> يمكنك استخدام المولد الذكي لإنشاء مجموعة أسئلة بسرعة حول أي موضوع، ثم التبديل للإدخال اليدوي لإضافة أسئلة محددة تريدها.
              </div>
            </div>

            <div className="space-y-6">
               <ManualCreator onAddQuestion={addQuestion} />
            </div>
          </div>
        )}

        {/* PREVIEW MODE */}
        {mode === 'preview' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                قائمة الأسئلة
              </h2>
              <div className="flex flex-wrap gap-2">
                 <button 
                  onClick={() => setIsShareOpen(true)}
                  disabled={questions.length === 0}
                  className="px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  <LinkIcon className="w-4 h-4" />
                  مشاركة
                </button>
                 <button 
                  onClick={clearAll}
                  disabled={questions.length === 0}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف الكل
                </button>
                <button
                  onClick={() => setMode('take')}
                  disabled={questions.length === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlayCircle className="w-5 h-5" />
                  بدء الاختبار
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <ListChecks className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-500">لا توجد أسئلة مضافة بعد</h3>
                <p className="text-gray-400 text-sm mt-1">ابدأ بإضافة أسئلة يدوياً أو باستخدام الذكاء الاصطناعي</p>
                <button 
                    onClick={() => setMode('create')}
                    className="mt-6 text-indigo-600 font-medium hover:underline"
                >
                    العودة للإنشاء
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">
                          {idx + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-800 pt-1">{q.text}</h3>
                      </div>
                      <button 
                        onClick={() => removeQuestion(q.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                        title="حذف السؤال"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3 pr-11">
                      {q.options.map((opt, optIdx) => (
                        <div 
                          key={optIdx} 
                          className={`p-3 rounded-lg text-sm border ${
                            optIdx === q.correctAnswerIndex 
                              ? 'bg-green-50 border-green-200 text-green-800 font-medium' 
                              : 'bg-gray-50 border-gray-100 text-gray-600'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAKE MODE */}
        {mode === 'take' && (
          <QuizTaker questions={questions} onExit={() => setMode('preview')} title={quizTitle} />
        )}
      </main>
    </div>
  );
};

export default App;