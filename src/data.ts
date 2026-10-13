export type Plan = {
  id: string;
  name: string;
  summary: string;
  tagline: string;
  price: number;
  original?: number;
  discount?: number;
  promo?: string;
  recommended?: boolean;
  data: string;
  call: string;
  sms: string;
  benefits: string[];
  tags: string[];
};

// 실습용 가상 요금제
export const PLANS: Plan[] = [
  {
    id: 'unlimited',
    name: '넉넉 무제한',
    summary: '데이터 무제한 · 통화 무제한 · 넷플릭스 포함',
    tagline: '영상·게임을 하루 종일 해도 걱정 없어요',
    price: 85000,
    original: 100000,
    discount: 15,
    promo: '24개월 할인 프로모션',
    recommended: true,
    data: '무제한',
    call: '집·이동전화 무제한',
    sms: '기본 제공',
    benefits: ['넷플릭스 스탠다드', '유튜브 프리미엄'],
    tags: ['데이터 많이', '구독 포함', '통화 많이'],
  },
  {
    id: 'standard-110',
    name: '스탠다드 110',
    summary: '데이터 110GB · 통화 무제한',
    tagline: '출퇴근 영상 시청에 넉넉한 데이터',
    price: 69000,
    original: 78000,
    discount: 12,
    promo: '24개월 할인 프로모션',
    recommended: true,
    data: '110GB',
    call: '집·이동전화 무제한',
    sms: '기본 제공',
    benefits: [],
    tags: ['데이터 많이', '통화 많이'],
  },
  {
    id: 'lite-30',
    name: '라이트 30',
    summary: '데이터 30GB · 통화 무제한',
    tagline: '와이파이 위주라면 이 정도면 충분해요',
    price: 49000,
    recommended: true,
    data: '30GB',
    call: '집·이동전화 무제한',
    sms: '기본 제공',
    benefits: [],
    tags: ['가성비', '통화 많이'],
  },
  {
    id: 'slim-10',
    name: '슬림 10',
    summary: '데이터 10GB · 통화 무제한',
    tagline: '통화 위주로 알뜰하게 쓰고 싶을 때',
    price: 39000,
    original: 43000,
    discount: 10,
    recommended: true,
    data: '10GB',
    call: '집·이동전화 무제한',
    sms: '기본 제공',
    benefits: [],
    tags: ['가성비', '통화 많이'],
  },
];

export const FILTERS = ['데이터 많이', '가성비', '구독 포함', '통화 많이'];

export const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
