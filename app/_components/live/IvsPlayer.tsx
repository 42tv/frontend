'use client';

import { useEffect, useRef } from 'react';

type Props = {
  streamUrl: string;
};

const IvsPlayer = ({ streamUrl }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const initPlayer = async () => {
        try {
          // amazon-ivs-player 모듈 동적 가져오기
          const IVSPlayer = await import('amazon-ivs-player');
          const { create, isPlayerSupported } = IVSPlayer;

          // 변경: isPlayerSupported를 함수 호출 대신 속성으로 확인
          // 참고: WebAssembly 파일이 /public/ivs/에 있는지 확인하세요.
          if (isPlayerSupported && videoRef.current) {
            // 변경: create 함수에 wasm 경로 제공
            const playerInstance = create({
               wasmWorker: '/ivs/amazon-ivs-wasmworker.min.js',
               wasmBinary: '/ivs/amazon-ivs-wasmworker.min.wasm',
            });
            playerRef.current = playerInstance; // 정리 액세스를 위해 ref에 저장
            playerInstance.attachHTMLVideoElement(videoRef.current); // 최신 ref 값 사용
            // streamUrl = "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8";
            playerInstance.load(streamUrl);
            playerInstance.play();
          } else if (!isPlayerSupported) {
            console.warn('IVS Player is not supported in this browser.');
          }
        } catch (err) {
          console.error("Failed to load or initialize IVS Player SDK", err);
        }
      };
      initPlayer();
    }

    // 정리 함수: 컴포넌트가 마운트 해제되거나 streamUrl이 변경될 때 실행
    return () => {
      if (playerRef.current) {
        console.log("Cleaning up IVS Player");
        playerRef.current.pause();
        playerRef.current.delete();
        playerRef.current = null;
      }
    };
  }, [streamUrl]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      playsInline
      style={{ width: '100%', borderRadius: '8px' }}
    />
  );
};

export default IvsPlayer;
