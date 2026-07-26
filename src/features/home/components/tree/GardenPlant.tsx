import { Image, StyleSheet, View } from 'react-native';
import {
  type GrowthStage,
} from '../../utils/gardenUtils';

interface GardenPlantProps {
  momentCount: number;
  dominantEmotion: string | null;
  dayIndex: number;
  theme: any;
  daysSinceCreation: number;
}

const SPROUT_HEIGHTS: Record<GrowthStage, number> = {
  empty: 0,
  seed: 60,
  sprout: 90,
  sapling: 120,
  bloom: 150,
  tree: 180,
};

const SPROUT_OPACITY: Record<GrowthStage, number> = {
  empty: 0,
  seed: 1,
  sprout: 1,
  sapling: 1,
  bloom: 1,
  tree: 1,
};

const getGrowthStage = (daysSinceCreation: number): GrowthStage => {
  if (daysSinceCreation <= 1) return 'seed';
  if (daysSinceCreation <= 3) return 'sprout';
  if (daysSinceCreation <= 5) return 'sapling';
  if (daysSinceCreation <= 7) return 'bloom';
  return 'tree';
};

const getPlantSource = (daysSinceCreation: number) => {
  if (daysSinceCreation <= 1) return require('../../../../../assets/images/nimo/sprout.png');
  if (daysSinceCreation <= 3) return require('../../../../../assets/images/nimo/sprout_level2_growth.png');
  if (daysSinceCreation <= 5) return require('../../../../../assets/images/nimo/sprout_level3_growth.png');
  if (daysSinceCreation <= 7) return require('../../../../../assets/images/nimo/sprout_level4_growth.png');
  return require('../../../../../assets/images/nimo/tree_memoryofthemonth.png');
};

export function GardenPlant({
  daysSinceCreation,
}: GardenPlantProps) {
  const stage = getGrowthStage(daysSinceCreation);
  const targetHeight = SPROUT_HEIGHTS[stage];
  const source = getPlantSource(daysSinceCreation);
  const asset = Image.resolveAssetSource(source);
  const aspectRatio = asset && asset.height > 0 ? asset.width / asset.height : 1;

  if (stage === 'empty') return null;

  return (
    <View style={styles.container}>
      <View style={styles.plantWrapper}>
        <Image
          source={source}
          style={{
            height: targetHeight,
            width: targetHeight,
            opacity: SPROUT_OPACITY[stage],
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
  },
  plantWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
});
