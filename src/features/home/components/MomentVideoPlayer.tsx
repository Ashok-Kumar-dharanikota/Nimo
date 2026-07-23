import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Play, Pause, Film } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { requireOptionalNativeModule } from 'expo';

interface MomentVideoPlayerProps {
  uri: string;
  className?: string;
  aspectRatio?: number;
}

// Safely check if native ExpoVideo module is present in the binary
const hasNativeVideoModule = Boolean(requireOptionalNativeModule('ExpoVideo'));

let useVideoPlayerHook: any = null;
let VideoViewComponent: any = null;

if (hasNativeVideoModule) {
  try {
    const expoVideo = require('expo-video');
    useVideoPlayerHook = expoVideo.useVideoPlayer;
    VideoViewComponent = expoVideo.VideoView;
  } catch (e) {
    // Native module load fallback
  }
}

function NativeVideoPlayer({ uri, className = '', aspectRatio = 1 }: MomentVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayerHook(uri, (p: any) => {
    p.loop = true;
    p.timeUpdateEventInterval = 0.5;
  });

  useEffect(() => {
    if (!player) return;
    const statusSub = player.addListener('playingChange', (event: any) => {
      setIsPlaying(event.isPlaying);
    });

    return () => {
      statusSub.remove();
    };
  }, [player]);

  const togglePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View
      className={`w-full aspect-square rounded-[16px] overflow-hidden bg-[#1c1a17] relative justify-center items-center ${className}`}
      style={{ aspectRatio }}
    >
      <VideoViewComponent
        style={StyleSheet.absoluteFill}
        player={player}
        nativeControls={false}
        fullscreenOptions={{ enable: false }}
        allowsPictureInPicture={false}
      />

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={togglePlayPause}
        className="w-12 h-12 rounded-full bg-black/40 border border-white/20 items-center justify-center shadow-lg z-10"
        style={{
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        {isPlaying ? (
          <Pause size={20} color="#ffffff" />
        ) : (
          <Play size={20} color="#ffffff" style={{ marginLeft: 2 }} />
        )}
      </TouchableOpacity>
    </View>
  );
}

function FallbackVideoPlayer({ className = '', aspectRatio = 1 }: MomentVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPlaying((prev) => !prev);
  };

  return (
    <View
      className={`w-full aspect-square rounded-[16px] overflow-hidden bg-[#1c1a17] relative justify-center items-center ${className}`}
      style={{ aspectRatio }}
    >
      <View className="absolute inset-0 bg-[#25221e] items-center justify-center p-4">
        <Film size={32} color="#a0b868" opacity={0.6} />
        <Text className="font-jakarta text-[11px] text-[#a89a8b] text-center mt-2 px-2">
          {isPlaying ? 'Playing Preview' : 'Video Moment'}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={togglePlayPause}
        className="w-12 h-12 rounded-full bg-black/40 border border-white/20 items-center justify-center shadow-lg z-10"
      >
        {isPlaying ? (
          <Pause size={20} color="#ffffff" />
        ) : (
          <Play size={20} color="#ffffff" style={{ marginLeft: 2 }} />
        )}
      </TouchableOpacity>
    </View>
  );
}

export function MomentVideoPlayer(props: MomentVideoPlayerProps) {
  if (hasNativeVideoModule && useVideoPlayerHook && VideoViewComponent) {
    return <NativeVideoPlayer {...props} />;
  }
  return <FallbackVideoPlayer {...props} />;
}

