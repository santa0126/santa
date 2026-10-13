import { useEffect, useState, type FormEvent } from 'react';
import { FILTERS, PLANS, won, type Plan } from './data';
import { BottomCTA, Button, Checkbox, DoneMark, FilterChip, Header, Input, ListRow, Skeleton, StateView, Tag } from './components/ui';

/* ---------- minimal history router ---------- */
function usePath() {
  const [path, setPath] = useState(() => (window.location.pathname === '/' ? '/plans' : window.location.pathname));
  useEffect(() => {
    const on = () => setPath(window.location.pathname);
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  const go = (to: string, replace = false) => {
    window.history[replace ? 'replaceState' : 'pushState'](null, '', to + window.location.search);
    setPath(to);
    window.scrollTo(0, 0);
  };
  return { path, go };
}

// ?state=loading|empty|error 로 각 화면의 상태를 미리볼 수 있다
const forced = new URLSearchParams(window.location.search).get('state');

/** 가상 조회: 600ms 지연 후 성공 (?state로 실패/빈 결과 강제) */
function useFetch<T>(load: () => T, key: unknown) {
  const [state, setState] = useState<{ status: 'loading' | 'ok' | 'error'; data?: T }>({ status: 'loading' });
  const [n, setN] = useState(0);
  useEffect(() => {
    setState({ status: 'loading' });
    if (forced === 'loading') return;
    const t = setTimeout(() => setState(forced === 'error' ? { status: 'error' } : { status: 'ok', data: load() }), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, n]);
  return { ...state, retry: () => setN((x) => x + 1) };
}

type Application = { no: string; plan: Plan; name: string; phone: string; at: Date };

const Page = ({ children, tint }: { children: React.ReactNode; tint?: boolean }) => (
  <div className={`flex min-h-dvh w-full flex-col ${tint ? 'bg-bg-default' : 'bg-bg-surface'}`}>{children}</div>
);
const Body = ({ children, center }: { children: React.ReactNode; center?: boolean }) => (
  <main className={`mx-auto flex w-full max-w-screen flex-1 flex-col gap-24 px-16 py-24 ${center ? 'items-center' : ''}`}>{children}</main>
);
const Cta = ({ children, amount }: { children: React.ReactNode; amount?: string }) => (
  <div className="sticky bottom-0 w-full bg-bg-surface">
    <div className="mx-auto w-full max-w-screen">
      <BottomCTA amount={amount}>{children}</BottomCTA>
    </div>
  </div>
);

/* ---------- 01 요금제 목록 ---------- */
function PlanList({ go }: { go: (to: string) => void }) {
  const [filter, setFilter] = useState(FILTERS[0]);
  const res = useFetch(() => {
    if (forced === 'empty') return [];
    // 추천순: 선택 조건에 맞는 요금제를 먼저
    return [...PLANS].sort((a, b) => Number(b.tags.includes(filter)) - Number(a.tags.includes(filter)));
  }, filter);

  return (
    <Page tint>
      <Header root title="요금제" />
      <Body>
        <div className="flex flex-col gap-8">
          <p className="font-kr-bold text-h3 font-bold text-text-primary">
            나에게 맞는 요금제를
            <br />
            골라보세요
          </p>
          <p className="font-kr-medium text-body-sm font-medium text-text-secondary">중요하게 보는 조건을 고르면 추천해 드려요</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-8" role="group" aria-label="조건 필터">
          {FILTERS.map((f) => (
            <FilterChip key={f} label={f} selected={f === filter} onClick={() => setFilter(f)} />
          ))}
        </div>
        <section className="flex flex-col gap-12">
          {res.status === 'loading' && (
            <>
              <Skeleton className="h-16 w-80" />
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-8 rounded-16 border border-border-default bg-bg-surface p-20">
                  <Skeleton className="h-icon w-48" />
                  <Skeleton className="h-icon w-1/2" />
                  <Skeleton className="h-16 w-3/4" />
                  <Skeleton className="h-field w-full" />
                </div>
              ))}
            </>
          )}
          {res.status === 'error' && (
            <StateView
              kind="error"
              title="요금제를 불러오지 못했어요"
              desc="잠시 후 다시 시도해 주세요"
              action={<Button variant="secondary" size="sm" onClick={res.retry}>다시 시도</Button>}
            />
          )}
          {res.status === 'ok' && res.data!.length === 0 && (
            <StateView kind="empty" title="조건에 맞는 요금제가 없어요" desc="다른 조건을 선택해 보세요" />
          )}
          {res.status === 'ok' && res.data!.length > 0 && (
            <>
              <p className="font-kr-medium text-caption font-medium text-text-tertiary">추천순 · {res.data!.length}개</p>
              {res.data!.map((p) => (
                <PlanCard key={p.id} plan={p} onDetail={() => go(`/plans/${p.id}`)} />
              ))}
            </>
          )}
        </section>
      </Body>
    </Page>
  );
}

function PlanCard({ plan, onDetail }: { plan: Plan; onDetail: () => void }) {
  return (
    <article className="flex flex-col items-start gap-8 rounded-16 border border-border-default bg-bg-surface p-20">
      {plan.recommended && <Tag>추천</Tag>}
      <p className="font-kr-bold text-subtitle font-bold text-text-primary">{plan.name}</p>
      <p className="font-kr-medium text-body-sm font-medium text-text-secondary">{plan.summary}</p>
      <div className="flex w-full items-end gap-12 pt-8">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
          <div className="flex items-center gap-8 font-kr-bold text-subtitle font-bold whitespace-nowrap">
            {plan.discount && <span className="text-text-accent">{plan.discount}%</span>}
            <span className="text-text-primary">월 {won(plan.price)}</span>
          </div>
          {plan.original && (
            <p className="font-kr-medium text-caption font-medium text-text-tertiary">월 {won(plan.original)}</p>
          )}
          {plan.promo && (
            <span className="flex h-icon items-center rounded-6 bg-bg-accent-subtle px-10 py-4 font-kr-bold text-caption font-bold text-text-accent">
              {plan.promo}
            </span>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={onDetail}>
          자세히
        </Button>
      </div>
    </article>
  );
}

/* ---------- 02 요금제 상세 ---------- */
function PlanDetail({ id, go, back, onApply }: { id: string; go: (to: string) => void; back: () => void; onApply: (p: Plan) => void }) {
  const res = useFetch(() => (forced === 'empty' ? undefined : PLANS.find((p) => p.id === id)), id);
  const plan = res.data;

  return (
    <Page>
      <Header title="요금제 상세" onBack={back} />
      <Body>
        {res.status === 'loading' && (
          <div className="flex flex-col gap-24">
            <div className="flex flex-col gap-8">
              <Skeleton className="h-icon w-48" />
              <Skeleton className="h-40 w-1/2" />
              <Skeleton className="h-20 w-3/4" />
            </div>
            <Skeleton className="h-80 w-full rounded-12" />
            <Skeleton className="h-80 w-full" />
          </div>
        )}
        {res.status === 'error' && (
          <StateView
            kind="error"
            title="상세 정보를 불러오지 못했어요"
            desc="잠시 후 다시 시도해 주세요"
            action={<Button variant="secondary" size="sm" onClick={res.retry}>다시 시도</Button>}
          />
        )}
        {res.status === 'ok' && !plan && (
          <StateView
            kind="empty"
            title="요금제를 찾을 수 없어요"
            desc="판매가 종료되었거나 잘못된 주소예요"
            action={<Button variant="secondary" size="sm" onClick={() => go('/plans')}>목록으로</Button>}
          />
        )}
        {plan && (
          <>
            <div className="flex flex-col items-start gap-8">
              {plan.recommended && <Tag>추천</Tag>}
              <p className="font-kr-bold text-h2 font-bold text-text-primary">{plan.name}</p>
              <p className="font-kr-medium text-body-sm font-medium text-text-secondary">{plan.tagline}</p>
            </div>
            <div className="flex flex-col gap-4 rounded-12 bg-bg-default p-20">
              <p className="font-kr-medium text-caption font-medium text-text-tertiary">월 요금</p>
              <div className="flex items-center gap-4 font-kr-bold font-bold">
                <span className="text-h2 text-text-primary">{won(plan.price)}</span>
                {plan.discount && <span className="text-subtitle text-text-accent">{plan.discount}%</span>}
              </div>
              {(plan.original || plan.promo) && (
                <p className="font-kr-medium text-caption font-medium text-text-tertiary">
                  {[plan.original && `${won(plan.original)}/월`, plan.promo && `${plan.promo} 적용`].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <section>
              <p className="font-kr-regular text-body text-text-primary">기본 제공</p>
              <ListRow label="데이터" value={plan.data} />
              <ListRow label="통화" value={plan.call} />
              <ListRow label="문자" value={plan.sms} />
            </section>
            {plan.benefits.length > 0 && (
              <section>
                <p className="font-kr-regular text-body text-text-primary">포함 혜택</p>
                {plan.benefits.map((b) => (
                  <ListRow key={b} check label={b} value="포함" />
                ))}
              </section>
            )}
          </>
        )}
      </Body>
      {plan && (
        <Cta amount={`월 ${won(plan.price)}`}>
          <Button onClick={() => onApply(plan)}>구독 신청하기</Button>
        </Cta>
      )}
    </Page>
  );
}

/* ---------- 03 구독 신청 ---------- */
const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};

function Apply({ plan, go, back, onDone }: { plan?: Plan; go: (to: string) => void; back: () => void; onDone: (a: Application) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(forced === 'loading');
  const [failed, setFailed] = useState(false);

  const errors = {
    name: name.trim().length < 2 ? '이름을 2자 이상 입력해주세요' : '',
    phone: /^01[016789]-\d{3,4}-\d{4}$/.test(phone) ? '' : '휴대폰 번호를 정확히 입력해주세요',
    agree: agree ? '' : '필수 항목에 동의해주세요',
  };
  const valid = !errors.name && !errors.phone && !errors.agree;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (!valid || submitting || !plan) return;
    setSubmitting(true);
    setFailed(false);
    setTimeout(() => {
      if (forced === 'error') {
        setSubmitting(false);
        setFailed(true);
        return;
      }
      const at = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const no = `${at.getFullYear()}-${pad(at.getMonth() + 1)}${pad(at.getDate())}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      onDone({ no, plan, name: name.trim(), phone, at });
    }, 900);
  };

  if (!plan || forced === 'empty') {
    return (
      <Page>
        <Header title="구독 신청" onBack={back} />
        <Body>
          <StateView
            kind="empty"
            title="선택한 요금제가 없어요"
            desc="요금제를 먼저 골라주세요"
            action={<Button variant="secondary" size="sm" onClick={() => go('/plans')}>요금제 보러 가기</Button>}
          />
        </Body>
      </Page>
    );
  }

  return (
    <Page>
      <Header title="구독 신청" onBack={back} />
      <form id="apply" onSubmit={submit} noValidate className="flex flex-1 flex-col">
        <Body>
          <p className="font-kr-bold text-h3 font-bold text-text-primary">
            신청 정보를
            <br />
            입력해주세요
          </p>
          <div className="rounded-12 bg-bg-default px-16 py-8">
            <ListRow label="선택한 요금제" value={plan.name} />
            <ListRow label="월 요금" value={won(plan.price)} last />
          </div>
          <div className="flex flex-col gap-20">
            <Input label="이름" value={name} onChange={setName} placeholder="김유플" maxLength={20} disabled={submitting} error={touched ? errors.name : ''} />
            <Input
              label="휴대폰 번호"
              value={phone}
              onChange={(v) => setPhone(formatPhone(v))}
              placeholder="010-1234-5678"
              inputMode="tel"
              disabled={submitting}
              error={touched ? errors.phone : ''}
            />
            <div className="flex flex-col gap-4">
              <Checkbox checked={agree} onChange={setAgree}>
                [필수] 개인정보 수집·이용에 동의합니다
              </Checkbox>
              {touched && errors.agree && <p className="pl-32 font-kr-medium text-caption font-medium text-text-error">{errors.agree}</p>}
            </div>
            {failed && (
              <p role="alert" className="rounded-8 bg-bg-error-subtle px-16 py-12 font-kr-medium text-body-sm font-medium text-text-error">
                신청에 실패했어요. 잠시 후 다시 시도해 주세요.
              </p>
            )}
          </div>
        </Body>
        <Cta>
          <Button type="submit" disabled={submitting}>
            {submitting ? '신청 중...' : '신청하기'}
          </Button>
        </Cta>
      </form>
    </Page>
  );
}

/* ---------- 04 신청 완료 ---------- */
const maskName = (n: string) => (n.length <= 1 ? n : n.length === 2 ? `${n[0]}*` : `${n[0]}${'*'.repeat(n.length - 2)}${n[n.length - 1]}`);
const maskPhone = (p: string) => p.replace(/^(\d{3})-\d{3,4}-(\d{4})$/, '$1-****-$2');

function Complete({ app, go }: { app?: Application; go: (to: string, replace?: boolean) => void }) {
  const toPlans = () => go('/plans', true);
  const a = forced === 'empty' ? undefined : app;
  const d = a?.at;
  return (
    <Page>
      <Header title="신청 완료" onBack={toPlans} />
      <Body center>
        {!a ? (
          <div className="w-full">
            <StateView kind="empty" title="확인할 신청 내역이 없어요" desc="요금제를 골라 신청해 주세요" />
          </div>
        ) : (
          <>
            <div className="flex w-full flex-col items-center gap-12 px-4 pt-24 pb-8 text-center">
              <DoneMark />
              <p className="font-kr-bold text-h3 font-bold text-text-primary">구독 신청이 완료됐어요</p>
              <p className="font-kr-medium text-body-sm font-medium text-text-secondary">개통 안내는 문자로 보내드려요</p>
            </div>
            <section className="w-full rounded-12 bg-bg-default px-16 pt-16 pb-8">
              <p className="font-kr-regular text-body text-text-primary">신청 내역</p>
              <ListRow label="신청 번호" value={a.no} />
              <ListRow label="요금제" value={a.plan.name} />
              <ListRow label="월 요금" value={won(a.plan.price)} />
              <ListRow
                label="신청 일시"
                value={`${d!.getMonth() + 1}월 ${d!.getDate()}일 ${String(d!.getHours()).padStart(2, '0')}:${String(d!.getMinutes()).padStart(2, '0')}`}
              />
              <ListRow label="신청자" value={`${maskName(a.name)} · ${maskPhone(a.phone)}`} last />
            </section>
          </>
        )}
      </Body>
      <Cta>
        <Button onClick={toPlans}>요금제 더 보기</Button>
      </Cta>
    </Page>
  );
}

export default function App() {
  const { path, go } = usePath();
  const [selected, setSelected] = useState<Plan>();
  const [app, setApp] = useState<Application>();
  const back = () => (window.history.length > 1 ? window.history.back() : go('/plans'));

  const detail = path.match(/^\/plans\/([^/]+)$/);
  if (detail)
    return (
      <PlanDetail
        id={detail[1]}
        go={go}
        back={back}
        onApply={(p) => {
          setSelected(p);
          go('/apply');
        }}
      />
    );
  if (path === '/apply')
    return (
      <Apply
        plan={selected}
        go={go}
        back={back}
        onDone={(a) => {
          setApp(a);
          go('/complete', true);
        }}
      />
    );
  if (path === '/complete') return <Complete app={app} go={go} />;
  return <PlanList go={go} />;
}
