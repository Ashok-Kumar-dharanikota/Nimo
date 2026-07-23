import { MemoryTree } from '@/features/home/components/tree/MemoryTree';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function GardenScreen() {
    const { memoryTree, isLoading } = useHomeData();
    return (
        <SafeAreaView className="flex-1 bg-[#fbf9f4]" edges={['top']}>
            <MemoryTree
                days={memoryTree}
                isLoading={isLoading}
                onBack={() => router.back()}
            />
        </SafeAreaView>
    );
}
