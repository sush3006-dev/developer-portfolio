import React from 'react';
import { SkillCategory } from '../../../data/skillsData';
import { getSkillSvgString } from './svgIconsData';

interface ClusterFallbackProps {
  category: SkillCategory;
}

export const ClusterFallback: React.FC<ClusterFallbackProps> = ({ category }) => {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-6 max-w-3xl mx-auto px-4">
        {category.skills.map((skill) => {
          const svgMarkup = getSkillSvgString(skill.id);
          return (
            <div
              key={skill.id}
              className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-white via-slate-50 to-amber-50/30 border-2 border-amber-300/80 shadow-lg flex flex-col items-center justify-center p-4 transition-transform hover:scale-105"
            >
              <div
                className="w-16 h-16 flex items-center justify-center mb-2"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">
                {skill.name}
              </span>
              {skill.tag && (
                <span className="text-[10px] font-mono font-semibold text-amber-700/80 mt-0.5">
                  {skill.tag}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

