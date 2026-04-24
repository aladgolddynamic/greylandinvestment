'use client';

import React from 'react';
import AboutHero from './AboutHero';
import WhoWeAre from './WhoWeAre';
import AboutWhatWeDo from './AboutWhatWeDo';
import MissionVision from './MissionVision';
import OurStrength from './OurStrength';
import { SiteContent } from '@/types/content';

interface AboutSectionProps {
    initialContent: SiteContent;
}

export default function AboutSection({ initialContent }: AboutSectionProps) {
    if (!initialContent) return null;

    return (
        <div id="about">
            <AboutHero title={initialContent.about.heroHeadline} subtitle={initialContent.about.heroSubtitle} />
            <WhoWeAre content={initialContent.about.narrative} />
            <AboutWhatWeDo />
            <OurStrength />
            <MissionVision mission={initialContent.about.mission} vision={initialContent.about.vision} />
        </div>
    );
}
