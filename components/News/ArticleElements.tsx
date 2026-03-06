'use client';

import React from 'react';

/**
 * Article Section Heading (Level 2)
 */
export const ArticleH2 = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl md:text-4xl font-black text-primary-dark uppercase tracking-tighter mt-16 mb-8 leading-tight text-left">
        {children}
    </h2>
);

/**
 * Article Sub-heading (Level 3)
 */
export const ArticleH3 = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl md:text-2xl font-black text-primary-dark uppercase tracking-tight mt-12 mb-6 text-primary-orange text-left">
        {children}
    </h3>
);

/**
 * Article Paragraph with Justification and Premium Line Height
 */
export const ArticleP = ({ children }: { children: React.ReactNode }) => (
    <p className="mb-10 text-gray-700/90 leading-[1.8] text-lg md:text-[21px] font-medium tracking-tight text-justify hyphens-auto">
        {children}
    </p>
);

/**
 * Premium Pull Quote Component
 */
export const ArticleQuote = ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-8 border-primary-orange pl-8 py-6 italic text-2xl text-primary-dark bg-orange-50/50 my-16 rounded-r-2xl font-bold leading-relaxed text-left">
        {children}
    </blockquote>
);

/**
 * Editorial Callout Box
 */
export const ArticleCallout = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-primary-dark text-white p-8 md:p-10 my-16 rounded-[2rem] border-l-[12px] border-primary-orange shadow-2xl text-left">
        <h4 className="text-primary-orange font-black uppercase tracking-[0.2em] text-xs mb-4">
            {title}
        </h4>
        <div className="m-0 text-white/90 text-xl font-bold leading-relaxed">
            {children}
        </div>
    </div>
);

/**
 * Custom Styled Lists
 */
export const ArticleList = ({ items, type = 'bullet' }: { items: string[]; type?: 'bullet' | 'number' }) => {
    const Component = type === 'number' ? 'ol' : 'ul';
    const listClasses = type === 'number'
        ? 'list-decimal marker:text-primary-orange marker:font-black'
        : 'list-disc marker:text-primary-orange';

    return (
        <Component className={`my-10 space-y-4 pl-6 text-left ${listClasses}`}>
            {items.map((item, index) => (
                <li key={index} className="pl-2 text-gray-700/90 text-lg font-medium leading-[1.8]">
                    {item}
                </li>
            ))}
        </Component>
    );
};
