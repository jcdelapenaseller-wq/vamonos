import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

export const GuideTOC: React.FC = () => {
    const [headings, setHeadings] = useState<{id: string, text: string}[]>([]);

    useEffect(() => {
        const h2s = Array.from(document.querySelectorAll('article h2'));
        const h2Data = h2s.map((h2, index) => {
            if (!h2.id) {
                h2.id = `section-${index}`;
            }
            return {
                id: h2.id,
                text: h2.textContent || ''
            };
        });
        setHeadings(h2Data);
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm my-10 not-prose">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <BookOpen size={18} className="text-brand-600"/>
                En esta guía
            </h4>
            <nav className="space-y-2">
                {headings.map(h => (
                    <a key={h.id} href={`#${h.id}`} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 text-slate-600 hover:text-brand-700 text-sm font-medium">
                        {h.text}
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
                    </a>
                ))}
            </nav>
        </div>
    );
};
