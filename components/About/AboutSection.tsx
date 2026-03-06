'use client';

import React, { useState, useEffect } from 'react';
import AboutHero from './AboutHero';
import WhoWeAre from './WhoWeAre';
import AboutWhatWeDo from './AboutWhatWeDo';
import MissionVision from './MissionVision';
import OurStrength from './OurStrength';
import { contentService } from '@/services/contentService';
import { SiteContent } from '@/types/content';

export default function AboutSection() {
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            const data = await contentService.getContent();
            setContent(data);
        };
        fetchContent();
    }, []);

    if (!content) return null;

    return (
        <div id="about">
            <AboutHero title={content.about.heroHeadline} subtitle={content.about.heroSubtitle} />
            <WhoWeAre content={content.about.narrative} />
            <AboutWhatWeDo />
            <OurStrength />
            <MissionVision mission={content.about.mission} vision={content.about.vision} />
        </div>
    );
}
