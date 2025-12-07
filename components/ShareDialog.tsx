import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { Question } from '../types';
import { generateShareLink } from '../services/shareService';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, questions }) => {
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState('');

  useEffect(() => {
    if (isOpen) {
        setLink(generateShareLink(questions, slug));
    }
  }, [isOpen, questions, slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-indigo-600" />
                مشاركة الاختبار
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    تخصيص الرابط (عنوان مميز)
                </label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="مثال: فيزياء-اول-ثانوي"
                        className="w-full p-3 pl-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-right" 
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    أضف اسماً مختصراً للرابط لسهولة التعرف عليه عند المشاركة.
                </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">
                    رابط المشاركة
                </label>
                <div className="break-all text-sm text-gray-600 font-mono mb-3 line-clamp-3 bg-white p-2 rounded border border-gray-100 dir-ltr text-left h-20 overflow-y-auto">
                    {link}
                </div>
                <button 
                    onClick={handleCopy}
                    className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                        copied 
                        ? 'bg-green-600 text-white shadow-md' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    }`}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            تم النسخ!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            نسخ الرابط
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;