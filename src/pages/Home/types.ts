export type HomeMenuType = 'featured' | 'regional';

export type IconTone =
  | 'red'
  | 'green'
  | 'blue'
  | 'purple'
  | 'yellow'
  | 'cyan'
  | 'orange';

export type IndustryChain = {
  id: string;
  name: string;
  icon: string;
  description?: string;
};

export type FeaturedTopic = {
  id: string;
  type: 'featured';
  title: string;
  icon: string;
  tone: IconTone;
  description: string;
  chains: IndustryChain[];
};

export type RegionalIndustryGroup = {
  id: string;
  title: string;
  description: string;
  chains: IndustryChain[];
};

export type RegionalPlan = {
  id: string;
  type: 'regional';
  title: string;
  icon: string;
  tone: IconTone;
  regionLabel: string;
  headline: string;
  groups: RegionalIndustryGroup[];
};

export type HomeSelection =
  | {
      type: 'featured';
      id: string;
    }
  | {
      type: 'regional';
      id: string;
    };
