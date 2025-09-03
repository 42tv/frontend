import { Article } from "../../_types/article";

export const mockArticles: Article[] = [
  {
    id: 1,
    title: '방송 장비 세팅 가이드 (5개 이미지)',
    content: '새로 구입한 방송 장비들을 세팅하는 과정을 단계별로 정리해봤습니다. 마이크, 카메라, 조명, 키보드, 모니터 설정 방법을 자세히 설명드리겠습니다.',
    authorIdx: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    viewCount: 342,
    images: [
      { id: 1, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=1', createdAt: '2024-01-15T10:30:00Z' },
      { id: 2, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=2', createdAt: '2024-01-15T10:30:00Z' },
      { id: 3, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=3', createdAt: '2024-01-15T10:30:00Z' },
      { id: 4, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=4', createdAt: '2024-01-15T10:30:00Z' },
      { id: 5, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=5', createdAt: '2024-01-15T10:30:00Z' }
    ]
  },
  {
    id: 2,
    title: '게임 플레이 하이라이트 (3개 이미지)',
    content: '오늘 방송에서 있었던 재미있는 게임 플레이 순간들을 정리해봤습니다. 특히 보스전에서의 극적인 승리 장면이 인상적이었어요!',
    authorIdx: 1,
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
    viewCount: 287,
    images: [
      { id: 6, articleId: 2, imageUrl: 'https://picsum.photos/400/300?random=6', createdAt: '2024-01-14T15:20:00Z' },
      { id: 7, articleId: 2, imageUrl: 'https://picsum.photos/400/300?random=7', createdAt: '2024-01-14T15:20:00Z' },
      { id: 8, articleId: 2, imageUrl: 'https://picsum.photos/400/300?random=8', createdAt: '2024-01-14T15:20:00Z' }
    ]
  },
  {
    id: 3,
    title: '새로운 프로필 사진 공개 (1개 이미지)',
    content: '새로운 프로필 사진을 촬영했습니다! 어떤가요? 이전 프로필보다 더 자연스럽고 밝은 느낌으로 찍어봤어요.',
    authorIdx: 1,
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-13T12:00:00Z',
    viewCount: 195,
    images: [
      { id: 9, articleId: 3, imageUrl: 'https://picsum.photos/400/300?random=9', createdAt: '2024-01-13T12:00:00Z' }
    ]
  },
  {
    id: 4,
    title: '다음 주 방송 일정 안내 (이미지 없음)',
    content: '다음 주 방송 일정을 안내드립니다. 월요일 오후 7시, 수요일 오후 8시, 금요일 오후 6시, 일요일 오후 5시에 방송할 예정입니다. 새로운 게임도 준비하고 있으니 많은 기대 부탁드려요!',
    authorIdx: 1,
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    viewCount: 423,
  },
];