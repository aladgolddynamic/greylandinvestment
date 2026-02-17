'use client';

import AboutHero from './AboutHero';
import WhoWeAre from './WhoWeAre';
import AboutWhatWeDo from './AboutWhatWeDo';
import MissionVision from './MissionVision';
import OurStrength from './OurStrength';

export default function AboutSection() {
    return (
        <div id="about">
            <AboutHero />
            <WhoWeAre />
            <AboutWhatWeDo />
            <OurStrength />
            <MissionVision />
        </div>
    );
}
