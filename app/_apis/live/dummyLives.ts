import { LiveStreamItem } from "./streams";

/**
 * dev 환경 전용 더미 라이브 데이터 생성기
 * - 검색(user_id / 방송제목) 및 페이지네이션 UI 확인용
 * - 시드 기반 의사난수를 사용해 새로고침해도 동일한 목록이 유지됩니다
 */

const TITLES: string[] = [
  "같이 듣는 새벽 감성 플레이리스트",
  "발로란트 랭크 다이아 가보자",
  "먹방) 마라탕 + 꿔바로우 조지기",
  "리그오브레전드 칼바람만 100판",
  "잔잔한 통기타 라이브",
  "공부 같이해요 스터디윗미",
  "야식 먹으면서 수다타임",
  "배틀그라운드 치킨 먹을 때까지",
  "그림 그리면서 노래 듣기",
  "주식 시황 브리핑 & 종목 이야기",
  "댄스 연습실 LIVE",
  "코딩 라이브 - 사이드 프로젝트 만들기",
  "심야 라디오 사연 읽어드립니다",
  "요리방송) 김치찌개 끓이기",
  "헬스장 운동 브이로그",
  "노래방 신청곡 받아요",
];

const NICKNAMES: string[] = [
  "달빛토끼",
  "게임왕철수",
  "먹짱유리",
  "새벽감성",
  "기타치는곰",
  "공부하는수달",
  "치킨헌터",
  "그림쟁이모모",
  "주식고수왕",
  "댄싱머신",
  "코딩하는판다",
  "라디오디제이",
  "요리왕비룡",
  "헬창라이프",
  "노래하는별",
  "은하수여행자",
];

const USER_ID_PREFIXES: string[] = [
  "moonrabbit",
  "gamer_cs",
  "mukbang_yuri",
  "dawnvibe",
  "guitar_bear",
  "study_otter",
  "chicken_hunter",
  "momo_draw",
  "stock_king",
  "dance_machine",
  "coding_panda",
  "radio_dj",
  "cook_dragon",
  "gym_life",
  "singing_star",
  "galaxy_walker",
];

/** 시드 기반 의사난수 생성기 (mulberry32) */
function createRandom(seed: number): () => number {
  let a = seed;
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 더미 라이브 목록 생성
 * @param count 생성할 개수 (기본 48개)
 */
export function generateDummyLives(count: number = 48): LiveStreamItem[] {
  const random = createRandom(42);
  const now = Date.now();

  return Array.from({ length: count }, (_, i): LiveStreamItem => {
    const titleBase = TITLES[i % TITLES.length];
    const nickname = NICKNAMES[i % NICKNAMES.length];
    const userId = `${USER_ID_PREFIXES[i % USER_ID_PREFIXES.length]}${Math.floor(i / USER_ID_PREFIXES.length) + 1}`;
    const isAdult = i % 9 === 4;
    const isFan = i % 5 === 2;
    const viewerCount = Math.floor(random() * 15000);
    const elapsedMinutes = 5 + Math.floor(random() * 600);

    return {
      thumbnail: `/dummy/thumb${(i % 8) + 1}.png`,
      start_time: new Date(now - elapsedMinutes * 60 * 1000).toISOString(),
      play_cnt: viewerCount + Math.floor(random() * 5000),
      recommend_cnt: Math.floor(random() * 3000),
      viewerCount,
      broadcaster: {
        idx: 100000 + i,
        user_id: userId,
        nickname: `${nickname}${Math.floor(i / NICKNAMES.length) + 1}`,
        profile_img: "",
        broadcastSetting: {
          is_adult: isAdult,
          is_fan: isFan,
          is_pw: false,
          title: `[더미${i + 1}] ${titleBase}`,
          fan_level: isFan ? 1 : 0,
        },
      },
    };
  });
}
