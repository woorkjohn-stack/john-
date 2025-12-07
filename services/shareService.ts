import { Question } from '../types';

// نستخدم مصفوفة مختصرة لتقليل حجم الرابط بدلاً من كائنات كاملة
// [نص السؤال، الخيارات، رقم الإجابة الصحيحة]
type MinifiedQuestion = [string, string[], number];

export const generateShareLink = (questions: Question[], slug?: string): string => {
  if (questions.length === 0) return window.location.href;
  
  const minified: MinifiedQuestion[] = questions.map(q => [
    q.text,
    q.options,
    q.correctAnswerIndex
  ]);
  
  // تحويل البيانات إلى JSON ثم تشفيرها بصيغة Base64
  // نستخدم encodeURIComponent لدعم الأحرف العربية بشكل صحيح
  const json = JSON.stringify(minified);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('q', encoded);
  
  if (slug && slug.trim()) {
    url.searchParams.set('slug', slug.trim());
  }

  return url.toString();
};

export const parseShareLink = (): { questions: Question[], slug?: string } | null => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('q');
  const slug = params.get('slug') || undefined;
  
  if (!encoded) return null;

  try {
    // فك التشفير
    const json = decodeURIComponent(escape(atob(encoded)));
    const minified: MinifiedQuestion[] = JSON.parse(json);
    
    if (!Array.isArray(minified)) return null;

    // إعادة بناء كائنات الأسئلة
    const questions = minified.map(m => ({
      id: crypto.randomUUID(), // توليد معرفات جديدة لهذه الجلسة
      text: m[0],
      options: m[1],
      correctAnswerIndex: m[2]
    }));

    return { questions, slug };
  } catch (error) {
    console.error("Error parsing share link:", error);
    return null;
  }
};