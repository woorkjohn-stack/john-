import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

interface QuizTakerProps {
  questions: Question[];
  onExit: () => void;
  title?: string;
}

const QuizTaker: React.FC<QuizTakerProps> = ({ questions, onExit, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
        <div className="mb-6 flex justify-center">
            {percentage >= 50 ? (
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
            ) : (
                 <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <XCircle className="w-12 h-12" />
                </div>
            )}
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {percentage >= 90 ? 'ممتاز!' : percentage >= 70 ? 'جيد جداً!' : percentage >= 50 ? 'جيد' : 'حاول مرة أخرى'}
        </h2>
        <p className="text-gray-500 mb-6">لقد أكملت الاختبار</p>

        <div className="text-5xl font-extrabold text-indigo-600 mb-8">
          %{percentage}
          <span className="text-xl text-gray-400 font-medium block mt-2">
            {score} من {questions.length} إجابات صحيحة
          </span>
        </div>

        <div className="flex gap-4 justify-center">
            <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
                <RotateCcw className="w-5 h-5" />
                إعادة المحاولة
            </button>
            <button
                onClick={onExit}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
                العودة للرئيسية
            </button>
        </div>
        
        {/* Results Review */}
        <div className="mt-12 text-right border-t pt-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800">مراجعة الإجابات</h3>
            <div className="space-y-6">
                {questions.map((q, idx) => {
                    const userAns = selectedAnswers[q.id];
                    const isCorrect = userAns === q.correctAnswerIndex;
                    return (
                        <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                            <p className="font-bold text-gray-800 mb-2">{idx + 1}. {q.text}</p>
                            <div className="space-y-1">
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className={`flex items-center gap-2 text-sm ${
                                        optIdx === q.correctAnswerIndex ? 'text-green-700 font-bold' : 
                                        (optIdx === userAns && !isCorrect) ? 'text-red-600 line-through' : 'text-gray-600'
                                    }`}>
                                        {optIdx === q.correctAnswerIndex && <CheckCircle2 className="w-4 h-4" />}
                                        {optIdx === userAns && !isCorrect && <XCircle className="w-4 h-4" />}
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {title && (
        <div className="mb-6 text-center">
          <span className="bg-white text-indigo-700 px-6 py-2 rounded-full text-lg font-bold shadow-sm border border-indigo-100 inline-block">
            {title}
          </span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6 text-gray-500 text-sm">
            <span>سؤال {currentIndex + 1} من {questions.length}</span>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
               {title ? 'عرض' : 'اختبار'}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 flex items-center justify-between group ${
                  selectedAnswers[currentQuestion.id] === index
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-lg">{option}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                   selectedAnswers[currentQuestion.id] === index ? 'border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'
                }`}>
                    {selectedAnswers[currentQuestion.id] === index && (
                        <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                    )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
            <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 text-gray-600 disabled:opacity-50 hover:text-indigo-600 transition-colors font-medium px-4 py-2"
            >
                <ArrowRight className="w-5 h-5" />
                السابق
            </button>

            {isLastQuestion ? (
                 <button
                 onClick={handleFinish}
                 disabled={selectedAnswers[currentQuestion.id] === undefined}
                 className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
               >
                 إنهاء الاختبار
                 <CheckCircle2 className="w-5 h-5" />
               </button>
            ) : (
                <button
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={selectedAnswers[currentQuestion.id] === undefined}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
              >
                التالي
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;