import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MessageSquare
} from 'lucide-react';
import { FAQ_DATA, EVENT_CONFIG } from '../../data/eventData';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [faqSearch, setFaqSearch] = useState('');
  const filteredFaqs = FAQ_DATA.filter((faq) => {
    return (
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
    );
  });

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/60 text-purple-300 text-xs font-mono mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4">
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Know</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Got questions about rules, team sizes, technology choices, or logistics? We've got answers.
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-end mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`glass-card rounded-2xl border transition-all overflow-hidden ${
                  isOpen ? 'border-purple-500/50 bg-[#12132b]' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs text-cyan-400 shrink-0">
                      ?
                    </span>
                    <h3 className="font-display font-semibold text-base sm:text-lg text-white">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="shrink-0 text-slate-400">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 text-center glass-card rounded-2xl p-6 border border-slate-800">
          <p className="text-xs sm:text-sm text-slate-300 mb-2">
            Have a different question not answered here?
          </p>
          <a
            href={`mailto:${EVENT_CONFIG.contactEmail}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Email the Organizing Team: {EVENT_CONFIG.contactEmail}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
