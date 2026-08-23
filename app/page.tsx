'use client';

import { useEffect, useState } from 'react';

type Stop = { name: string; korean: string; note: string; booking?: string };
type Day = { date: string; day: string; theme: string; description: string; stops: Stop[]; must?: string };
type ExploreStop = Stop & { district: string; category: string };
type TripNote = { id: number; place_key: string; author: string; body: string; created_at: string; image_key: string | null };

const days: Day[] = [
  { date: 'Aug 25', day: 'Tue · Silka', theme: 'Arrival & recovery', description: 'Airport, bags, a nearby meal, nap and early night.', stops: [{ name: 'Home base', korean: '서울 종로구 창덕궁길 59-2', note: 'Jongno / Changdeokgung-gil' }] },
  { date: 'Aug 26', day: 'Wed · Silka', theme: 'Nails & designer second-hand', description: 'Keep it gentle: nails in Myeongdong, then Apgujeong resale browsing.', stops: [{ name: 'Gugus Apgujeong', korean: '서울 강남구 선릉로 846 구구스 압구정점', note: 'Pre-owned luxury' }, { name: 'Mihou’s Nail', korean: '서울 중구 명동', note: 'Message +82 10-5779-0737 on WhatsApp first' }], must: 'Arrange Mihou’s Nail if you want it.' },
  { date: 'Aug 27', day: 'Thu · Silka', theme: 'Work day', description: 'A quiet reading/work block, then a small local meal.', stops: [{ name: 'Hyundai Card Art Library', korean: '서울 용산구 이태원로 248 현대카드 아트 라이브러리', note: 'Bring photo ID and DIVE app' }, { name: 'Cafe Onion Anguk', korean: '서울 종로구 계동길 5 카페 어니언 안국점', note: 'Near home fallback' }] },
  { date: 'Aug 28', day: 'Fri · Silka', theme: 'Work & archive shopping', description: 'Morning work, then a light browse before Teresa arrives.', stops: [{ name: 'VASS Archive / Vintage', korean: '서울 마포구 독막로15길 3-18 1층 베이스', note: 'Check Instagram for current curation' }] },
  { date: 'Aug 29', day: 'Sat · together', theme: 'Arrival & Gyeongbokgung', description: 'Teresa arrives; keep the first afternoon beautiful but flexible.', stops: [{ name: 'Gyeongbokgung Palace', korean: '서울 종로구 사직로 161 경복궁', note: 'Aim to arrive 16:15–16:45; last entry 17:30' }, { name: 'ANAM', korean: '서울 종로구 계동길 37 안암', note: 'Welcome dinner option' }], must: 'If arrival runs late, skip the palace and wander Bukchon instead.' },
  { date: 'Aug 30', day: 'Sun · together', theme: 'Seongsu: design & fashion', description: 'A full, loose day of concept spaces, gallery, fashion and tea.', stops: [{ name: 'Foreplan', korean: '서울 성동구 왕십리로14길 30-11 포플랜', note: 'Coffee / brunch' }, { name: '032c Gallery Seoul', korean: '서울 성동구 성수이로10길 14 032c 갤러리 서울', note: 'Gallery' }, { name: 'HAUS NOWHERE + NUDAKE Tea House', korean: '서울 성동구 뚝섬로 433 하우스 노웨어 서울', note: 'Tea House is on 5F' }] },
  { date: 'Aug 31', day: 'Mon · together', theme: 'Yeonnam & Hongdae', description: 'A softer neighbourhood day: coffee, park, shops and dinner.', stops: [{ name: 'Coffee Nap Roasters', korean: '서울 마포구 성미산로27길 70 커피냅로스터스', note: 'Coffee' }, { name: 'Hangong-Gan', korean: '서울 마포구 연남동 561-4 한공간', note: 'Dinner; message them first' }] },
  { date: 'Sep 1', day: 'Tue · together', theme: 'Hannam: art, fashion & dinner', description: 'A considered museum and fashion day, ending with your nicest dinner.', stops: [{ name: 'Leeum Museum of Art', korean: '서울 용산구 이태원로55길 60-16 리움미술관', note: 'Architecture + exhibition' }, { name: 'SAN SAN GEAR Hannam', korean: '서울 용산구 이태원로55길 37-10 산산기어 한남', note: 'New DAIKEI MILLS-designed flagship' }, { name: 'Gongi', korean: '서울 용산구 이태원로45길 4 공기', note: 'Dinner' }], must: 'Book Leeum and Gongi.' },
  { date: 'Sep 2', day: 'Wed · together', theme: 'Museum SAN, Wonju', description: 'The full-day architecture pilgrimage: Tadao Ando, landscape, James Turrell, Meditation Hall and Antony Gormley, followed by a nearby contemporary-art stop.', stops: [{ name: 'Museum SAN', korean: '강원특별자치도 원주시 지정면 오크밸리2길 260 뮤지엄산', note: 'Leave Seoul early; allow an unhurried 4–5 hours', booking: 'https://app.museumsan.org/eng/guidance/view_guide.jsp?m=5&s=2' }, { name: 'Glacier Museum of Art (빙하미술관)', korean: '강원특별자치도 원주시 지정면 구재로 66 빙하미술관', note: 'Afternoon contemporary-art stop; take a taxi from Museum SAN', booking: 'https://www.gmoa.kr/' }], must: 'Buy the Signature Pass if available; aim for Glacier Museum in the mid-afternoon.' },
  { date: 'Sep 3', day: 'Thu · together', theme: 'Audeum & Frieze', description: 'Early sound-and-architecture museum, then optional art fair afternoon.', stops: [{ name: 'Audeum Audio Museum', korean: '서울 서초구 신원동 560 오디움', note: 'Kengo Kuma; ticket required', booking: 'https://audeum.org/booking' }, { name: 'COEX / Frieze Seoul', korean: '서울 강남구 영동대로 513 코엑스', note: 'General entry from 15:00' }], must: 'Audeum first; Frieze only if the day still feels generous.' },
  { date: 'Sep 4', day: 'Fri · together', theme: 'Samcheong & Bukchon', description: 'Serious art, independent galleries and the Es Devlin installation.', stops: [{ name: 'MMCA Seoul', korean: '서울 종로구 삼청로 30 국립현대미술관 서울', note: 'Do Ho Suh + conceptual art' }, { name: 'FUTURA SEOUL', korean: '서울 종로구 북촌로 61 푸투라서울', note: 'Es Devlin: Come Home Again', booking: 'https://www.futuraseoul.org/57' }] },
  { date: 'Sep 5', day: 'Sat · together', theme: 'Slow Jongno + fireworks', description: 'Keep the day light, rest in the afternoon, then choose the ticketed Nodeul experience or a free riverside viewing spot.', stops: [{ name: 'Nodeul Island Orange Play Zone', korean: '서울 용산구 노들섬', note: 'Ticketed area; wristband exchange closes 17:00', booking: 'https://www.hanwhafireworks.com/' }, { name: 'Yeouido Hangang Park', korean: '서울 영등포구 여의동로 330 여의도한강공원', note: 'Free and closest to the display; extremely busy—claim a riverside spot early' }, { name: 'Ichon Hangang Park', korean: '서울 용산구 이촌로72길 62 이촌한강공원', note: 'Free, across the river and calmer; the better fallback for a less packed evening' }], must: 'On arrival, ask the accommodation host to book two Orange Play Zone tickets. If they book in their name, confirm exactly how wristband collection will work. Otherwise choose Ichon Hangang Park and arrive by early afternoon.' },
  { date: 'Sep 6', day: 'Sun · departure', theme: 'Airport day', description: 'Pack, breakfast nearby and leave from Seoul Station around 15:20–15:30.', stops: [{ name: 'Incheon Terminal 1', korean: '인천국제공항 제1여객터미널', note: 'Teresa' }, { name: 'Incheon Terminal 2', korean: '인천국제공항 제2여객터미널', note: 'Silka' }] },
];

const explore: ExploreStop[] = [
  { name: 'Gyeongbokgung Palace', korean: '서울 종로구 사직로 161 경복궁', note: 'Joseon palace', district: 'Jongno / Bukchon', category: 'Art & architecture' },
  { name: 'MMCA Seoul', korean: '서울 종로구 삼청로 30 국립현대미술관 서울', note: 'National contemporary art museum', district: 'Jongno / Bukchon', category: 'Art & architecture' },
  { name: 'FUTURA SEOUL', korean: '서울 종로구 북촌로 61 푸투라서울', note: 'Es Devlin exhibition', district: 'Jongno / Bukchon', category: 'Art & architecture', booking: 'https://www.futuraseoul.org/57' },
  { name: 'Kukje Gallery', korean: '서울 종로구 삼청로 54 국제갤러리', note: 'Contemporary gallery', district: 'Jongno / Bukchon', category: 'Art & architecture' },
  { name: 'Museum Hanmi Samcheong', korean: '서울 종로구 삼청로 11길 11 뮤지엄한미 삼청', note: 'Photography and contemporary art', district: 'Jongno / Bukchon', category: 'Art & architecture' },
  { name: 'Cafe Onion Anguk', korean: '서울 종로구 계동길 5 카페 어니언 안국점', note: 'Hanok bakery café — optional', district: 'Jongno / Bukchon', category: 'Coffee & tea' },
  { name: 'Cheongsudang', korean: '서울 종로구 돈화문로11나길 31-9 청수당', note: 'Dessert / tea close to home — optional', district: 'Jongno / Bukchon', category: 'Coffee & tea' },
  { name: 'Ouvert Coffee Bar', korean: '서울 종로구 필운대로1길 3 우베르트 커피바', note: 'Seochon coffee — optional', district: 'Jongno / Bukchon', category: 'Coffee & tea' },
  { name: 'ANAM', korean: '서울 종로구 계동길 37 안암', note: 'Pork-and-rice-soup local meal', district: 'Jongno / Bukchon', category: 'Food & drinks' },
  { name: 'Hwangsaengga Kalguksu', korean: '서울 종로구 북촌로5길 78 황생가칼국수', note: 'Kalguksu and mandu', district: 'Jongno / Bukchon', category: 'Food & drinks' },
  { name: 'Gaeseong Mandu Koong', korean: '서울 종로구 인사동10길 11-3 개성만두 궁', note: 'Hanok mandu restaurant', district: 'Jongno / Bukchon', category: 'Food & drinks' },
  { name: 'Imun Seollongtang', korean: '서울 종로구 우정국로 38-13 이문설농탕', note: 'Historic soup breakfast', district: 'Jongno / Bukchon', category: 'Food & drinks' },
  { name: '032c Gallery Seoul', korean: '서울 성동구 성수이로10길 14 032c 갤러리 서울', note: 'Fashion / publishing / exhibition space', district: 'Seongsu', category: 'Art & architecture' },
  { name: 'HAUS NOWHERE + NUDAKE Tea House', korean: '서울 성동구 뚝섬로 433 하우스 노웨어 서울', note: 'Conceptual retail; Tea House on 5F', district: 'Seongsu', category: 'Fashion & design', booking: 'https://nudake.com/kr/store/tea-house/' },
  { name: 'Tamburins Seongsu', korean: '서울 성동구 성수동 탬버린즈 성수', note: 'Retail architecture', district: 'Seongsu', category: 'Fashion & design' },
  { name: 'ADER Error Seongsu', korean: '서울 성동구 성수동 아더에러 성수', note: 'Experimental fashion flagship', district: 'Seongsu', category: 'Fashion & design' },
  { name: 'Dior Seongsu', korean: '서울 성동구 성수동 디올 성수', note: 'Check current public access', district: 'Seongsu', category: 'Fashion & design' },
  { name: 'Foreplan', korean: '서울 성동구 왕십리로14길 30-11 포플랜', note: 'Coffee/brunch — optional', district: 'Seongsu', category: 'Coffee & tea' },
  { name: 'Coffee Nap Roasters', korean: '서울 마포구 성미산로27길 70 커피냅로스터스', note: 'Coffee — optional', district: 'Yeonnam / Hongdae', category: 'Coffee & tea' },
  { name: 'Protokoll Yeonhui', korean: '서울 서대문구 연희로 109 2층 프로토콜', note: 'Coffee / work fallback — optional', district: 'Yeonnam / Hongdae', category: 'Coffee & tea' },
  { name: 'Protokoll Sangsu', korean: '서울 마포구 어울마당로2길 13-4 프로토콜', note: 'Coffee — optional', district: 'Yeonnam / Hongdae', category: 'Coffee & tea' },
  { name: 'Seian Spa Yeonnam', korean: '서울 마포구 동교로29길 64 영인빌딩 2층 세이안스파', note: 'Women-only shared scrub', district: 'Yeonnam / Hongdae', category: 'Wellness & work' },
  { name: 'Hangong-Gan', korean: '서울 마포구 연남동 561-4 한공간', note: 'Asian-fusion dinner', district: 'Yeonnam / Hongdae', category: 'Food & drinks' },
  { name: 'Leeum Museum of Art', korean: '서울 용산구 이태원로55길 60-16 리움미술관', note: 'OMA, Mario Botta and Jean Nouvel', district: 'Hannam / Itaewon', category: 'Art & architecture', booking: 'https://ticket.leeum.org/leeum/personal/exhibitList.do' },
  { name: 'SAN SAN GEAR Hannam', korean: '서울 용산구 이태원로55길 37-10 산산기어 한남', note: 'New fashion flagship in a former house', district: 'Hannam / Itaewon', category: 'Fashion & design' },
  { name: 'Millimeter Milligram', korean: '서울 용산구 이태원로 240 밀리미터밀리그람', note: 'Korean design goods', district: 'Hannam / Itaewon', category: 'Fashion & design' },
  { name: 'Wooyoungmi Seoul Flagship', korean: '서울 용산구 한남동 우영미 플래그십스토어', note: 'Architecture-led fashion store', district: 'Hannam / Itaewon', category: 'Fashion & design' },
  { name: 'Hyundai Card Art Library', korean: '서울 용산구 이태원로 248 현대카드 아트 라이브러리', note: 'DIVE app + photo ID required', district: 'Hannam / Itaewon', category: 'Wellness & work' },
  { name: 'Gongi', korean: '서울 용산구 이태원로45길 4 공기', note: 'Modern Korean dinner', district: 'Hannam / Itaewon', category: 'Food & drinks', booking: 'https://www.catchtable.net/shop/gonggi' },
  { name: 'Hahouse Café', korean: '서울 용산구 이태원로54가길 8 2층 하우스', note: 'Concrete / timber café — optional', district: 'Hannam / Itaewon', category: 'Coffee & tea' },
  { name: 'Frieze House Seoul', korean: '서울 중구 동호로15길 17 프리즈 하우스 서울', note: 'Contemporary-art venue', district: 'Jung / Euljiro', category: 'Art & architecture' },
  { name: 'piknic', korean: '서울 중구 퇴계로6가길 30 피크닉', note: 'COMPANY World Affair through Sep 6', district: 'Jung / Euljiro', category: 'Art & architecture' },
  { name: 'The Book Society Hoehyeon', korean: '서울 중구 퇴계로4길 2 로컬스티치 C동 3층 더북소사이어티', note: 'Independent art and publishing', district: 'Jung / Euljiro', category: 'Art & architecture' },
  { name: 'Seosomun Shrine History Museum', korean: '서울 중구 칠패로 5 서소문성지역사박물관', note: 'Contemplative underground architecture', district: 'Jung / Euljiro', category: 'Art & architecture' },
  { name: 'Jean Frigo', korean: '서울 중구 퇴계로62길 9-8 장프리고', note: 'Refrigerator-door cocktail bar', district: 'Jung / Euljiro', category: 'Food & drinks' },
  { name: 'Dongdaemun Design Plaza', korean: '서울 중구 을지로 281 동대문디자인플라자', note: 'Zaha Hadid landmark', district: 'Dongdaemun', category: 'Art & architecture' },
  { name: 'House of Dior Seoul', korean: '서울 강남구 압구정로 464 하우스 오브 디올', note: 'Christian de Portzamparc exterior', district: 'Dosan / Gangnam', category: 'Fashion & design' },
  { name: 'Sulwhasoo Flagship', korean: '서울 강남구 도산대로45길 18 설화수 플래그십스토어', note: 'Neri&Hu; best at dusk', district: 'Dosan / Gangnam', category: 'Art & architecture' },
  { name: 'JUUN.J Dosan Flagship', korean: '서울 강남구 언주로164길 23 준지 도산 플래그십스토어', note: 'Fashion architecture', district: 'Dosan / Gangnam', category: 'Fashion & design' },
  { name: 'Gugus Apgujeong', korean: '서울 강남구 선릉로 846 구구스 압구정점', note: 'Pre-owned luxury', district: 'Dosan / Gangnam', category: 'Fashion & design' },
  { name: 'Urban Hive', korean: '서울 강남구 논현동 200-7 어반하이브', note: 'Perforated-concrete exterior', district: 'Dosan / Gangnam', category: 'Art & architecture' },
  { name: 'COEX / Frieze Seoul', korean: '서울 강남구 영동대로 513 코엑스', note: 'Frieze art fair', district: 'Gangnam / COEX', category: 'Art & architecture' },
  { name: 'Audeum Audio Museum', korean: '서울 서초구 헌릉로8길 6 오디움', note: 'Kengo Kuma; reservation required', district: 'Outer Seoul', category: 'Art & architecture', booking: 'https://audeum.org/booking' },
  { name: 'LG Arts Center Seoul', korean: '서울 강서구 마곡중앙로 136 LG아트센터 서울', note: 'Tadao Ando performance complex', district: 'Outer Seoul', category: 'Art & architecture' },
  { name: 'Mullae Industrial Arts District', korean: '서울 영등포구 문래동', note: 'Steel workshops, studios and evening bars', district: 'Outer Seoul', category: 'Art & architecture' },
  { name: 'Vinyl House', korean: '서울 영등포구 도림로128가길 13-8 비닐하우스', note: 'Natural wine dinner in Mullae', district: 'Outer Seoul', category: 'Food & drinks' },
  { name: 'Museum SAN', korean: '강원특별자치도 원주시 지정면 오크밸리2길 260 뮤지엄산', note: 'Tadao Ando day trip', district: 'Day trips', category: 'Art & architecture', booking: 'https://app.museumsan.org/eng/guidance/view_guide.jsp?m=5&s=2' },
  { name: 'Glacier Museum of Art (빙하미술관)', korean: '강원특별자치도 원주시 지정면 구재로 66 빙하미술관', note: 'Contemporary art and architecture near Museum SAN', district: 'Day trips', category: 'Art & architecture', booking: 'https://www.gmoa.kr/' },
  { name: 'Hoam Museum of Art', korean: '경기 용인시 처인구 포곡읍 에버랜드로562번길 38 호암미술관', note: 'Museum and gardens', district: 'Day trips', category: 'Art & architecture' },
  { name: 'Mimesis Art Museum', korean: '경기 파주시 문발로 253 미메시스 아트 뮤지엄', note: 'Architectural museum in Paju', district: 'Day trips', category: 'Art & architecture' },
  { name: 'Eunpyeong Hanok Village', korean: '서울 은평구 진관동 은평한옥마을', note: 'Hanok village beneath Bukhansan', district: 'Day trips', category: 'Art & architecture' },
];

function naver(query: string) { return `https://map.naver.com/p/search/${encodeURIComponent(query)}`; }
function kakao(query: string) { return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`; }
function webSearch(query: string) { return `https://www.google.com/search?q=${encodeURIComponent(query)}`; }
function imageSearch(query: string) { return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${query} Instagram`)}`; }
const pendingImages = new Map<string, File | null>();

function NoteBox({ placeKey, notes, onAdd }: { placeKey: string; notes: TripNote[]; onAdd: (author: string, body: string, image: File | null) => Promise<void> }) {
  const [author, setAuthor] = useState('Silka');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      pendingImages.set(placeKey, image);
      await onAdd(author, body, image);
      setBody('');
      setImage(null);
    } catch {
      setError('Could not save that note. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return <details className="note-box"><summary>Trip notes {notes.length ? `· ${notes.length}` : ''}</summary><div className="note-content">{notes.length > 0 && <div className="saved-notes">{notes.map((note) => <div className="saved-note" key={note.id}><p><strong>{note.author}</strong><span>{note.body}</span></p>{note.image_key && <img src={`/api/images/${note.image_key}`} alt={`Trip memory from ${note.author}`} />}</div>)}</div>}<form onSubmit={submit}><input aria-label="Your name" value={author} onChange={(event) => setAuthor(event.target.value)} maxLength={32} required /><textarea aria-label={`Your note about ${placeKey}`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="What did you like?" maxLength={600} required /><input className="image-input" aria-label="Attach a photo" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={(event) => setImage(event.target.files?.[0] ?? null)} /><button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save note'}</button>{error && <small>{error}</small>}</form></div></details>;
}

function TravelTips() {
  return <section id="travel-tips" className="travel-tips"><div className="section-head"><p className="eyebrow">Field guide</p><h2>Travel tips, in the order you’ll need them.</h2><p>Designed for two people moving easily through Seoul—without turning the trip into logistics.</p></div><div className="tip-grid"><article><p className="tip-number">01 · Before you leave</p><h3>Set up your phone</h3><ul><li>Download <a href="https://map.naver.com/" target="_blank">Naver Map</a> for walking and transit, plus <a href="https://www.kakaomobility.com/en/" target="_blank">Kakao T</a> for taxis.</li><li>Keep this site bookmarked; every card has a Korean address and navigation link.</li><li>Install Papago or use your phone’s translation tool. Screenshot booking confirmations and Korean addresses.</li></ul></article><article><p className="tip-number">02 · Your first hour</p><h3>Arriving at Incheon</h3><ul><li>Silka arrives at Terminal 2; Teresa arrives at Terminal 1. Do immigration, bags, then buy a T-money card before leaving the airport/at the first station.</li><li>Best-value route: AREX to Seoul Station, then taxi to Changdeokgung-gil with luggage.</li><li>Use a regular airport taxi only if jet lag, rain, bags, or early room access makes door-to-door ease worth it.</li></ul><a className="tip-link" href="https://english.seoul.go.kr/service/entry/getting-to-seoul-from-incheon-airport/" target="_blank">Airport transport guide ↗</a></article><article><p className="tip-number">03 · Everyday transport</p><h3>Buy the right card</h3><ul><li><strong>T-money: one each, essential.</strong> Use it for subway, buses, taxis, AREX and anything outside central Seoul.</li><li><strong>Climate Card: optional.</strong> It is worthwhile on dense Seoul-only days; short passes cost ₩5,000 / ₩8,000 / ₩10,000 / ₩15,000 / ₩20,000 for 1 / 2 / 3 / 5 / 7 days.</li><li>Keep T-money even if you use Climate Card: the airport rail and regional/day-trip journeys are not covered.</li></ul><a className="tip-link" href="https://english.seoul.go.kr/policy/transportation/climate-card/" target="_blank">Climate Card rules & coverage ↗</a></article><article><p className="tip-number">04 · Moving around Seoul</p><h3>Fastest vs cheapest</h3><ul><li>Default to subway and bus. Always tap <strong>on and off</strong> so transfers calculate correctly.</li><li>Use Kakao T or a street taxi together late at night, in hard rain, with shopping bags, or when it saves 30+ minutes.</li><li>Show the driver the Korean address from this site rather than pronouncing an English name.</li><li>Avoid the sharpest rush hours—roughly 08:00–09:30 and 17:30–19:30—when possible.</li></ul><a className="tip-link" href="https://english.seoul.go.kr/policy/transportation/modes-of-transport/taxi/" target="_blank">Taxi guide & fares ↗</a></article><article><p className="tip-number">05 · Payments & practicalities</p><h3>Make the small things easy</h3><ul><li>Cards are widely accepted, but carry a small amount of KRW for transit top-ups, markets and tiny businesses.</li><li>International cards can now buy/reload short-term Climate Cards; do not assume the same for every T-money counter.</li><li>Use a portable battery—navigation, photos and translations drain a phone quickly.</li><li>Independent cafés, bars and galleries change hours: use the live links on each card before crossing the city.</li></ul><a className="tip-link" href="https://english.seoul.go.kr/climate-cards-and-single-journey-transit-tickets-now-accepting-international-credit-cards-no-cash-needed/" target="_blank">International-card update ↗</a></article><article><p className="tip-number">06 · Fixed bookings</p><h3>Book the anchors, float the rest</h3><ul><li>Priority bookings: Audeum, Leeum, Museum SAN, Gongi and the Orange Play Zone fireworks ticket.</li><li>For Audeum, each person needs their own reservation. For the fireworks, exchange the wristband by 17:00.</li><li>Keep cafés and browsing flexible; this is intentional, so you can stay longer in the places that move you.</li></ul></article><article className="tip-wide"><p className="tip-number">07 · Fireworks · Saturday 5 September</p><h3>Ticketed Nodeul, or the free riverside plan</h3><p><strong>First thing on arrival:</strong> ask the accommodation host whether they can book two Orange Play Zone tickets using a Korean number. If they book in their name, ask them to confirm how you will collect the wristbands; the ticket booth closes at 17:00.</p><p><strong>Free fallback:</strong> Yeouido Hangang Park is closest and most electric, but extremely crowded. Ichon Hangang Park, across the river, is the calmer choice and the one I’d use if tickets do not work out. Bring a picnic mat, water, power bank and layers; arrive by early afternoon for a reasonable view. Nodeul Island itself is ticket-only this year.</p><a className="tip-link" href="https://www.hanwhafireworks.com/" target="_blank">Official festival information ↗</a></article><article className="tip-wide"><p className="tip-number">08 · Departure day · Sunday 6 September</p><h3>Leave together, split at the terminals</h3><p>Start from Seoul Station around 15:20–15:30. Take AREX according to the live timetable; Teresa gets off at Terminal 1 and Silka continues to Terminal 2. Aim to be at your terminal around three hours before departure, and check the train schedule the night before.</p><a className="tip-link" href="https://www.arex.or.kr/main.do?lang=en" target="_blank">AREX live information ↗</a></article></div><p className="tip-footnote">Skip the Discover Seoul Pass for this trip: it is an attraction pass, not a normal public-transport pass, and your itinerary is mostly galleries, architecture, neighbourhoods and a few reservations.</p></section>;
}

export default function Home() {
  const [tab, setTab] = useState<'itinerary' | 'explore' | 'tips'>('itinerary');
  const [active, setActive] = useState('All');
  const [district, setDistrict] = useState('All districts');
  const [category, setCategory] = useState('All categories');
  const [notes, setNotes] = useState<TripNote[]>([]);
  useEffect(() => {
    fetch('/api/notes').then((response) => response.ok ? response.json() : { notes: [] }).then((data) => setNotes(data.notes ?? [])).catch(() => undefined);
  }, []);
  async function addNote(placeKey: string, author: string, body: string, image?: File | null) {
    const selectedImage = image ?? pendingImages.get(placeKey) ?? null;
    const form = new FormData();
    form.set('placeKey', placeKey);
    form.set('author', author);
    form.set('body', body);
    if (selectedImage) form.set('image', selectedImage);
    const response = await fetch('/api/notes', { method: 'POST', body: form });
    if (!response.ok) throw new Error('Save failed');
    const data = await response.json();
    setNotes((current) => [data.note, ...current]);
  }
  const shown = active === 'All' ? days : days.filter((d) => d.day.includes(active));
  const districts = ['All districts', ...Array.from(new Set(explore.map((stop) => stop.district)))];
  const categories = ['All categories', ...Array.from(new Set(explore.map((stop) => stop.category)))];
  const nearby = explore.filter((stop) => (district === 'All districts' || stop.district === district) && (category === 'All categories' || stop.category === category));
  return <main>
    <section className="hero"><p className="eyebrow">Seoul · Wonju · 25 Aug — 6 Sep 2026</p><h1>Silka & Teresa<br /><em>in Korea</em></h1><p className="lede">A living, clickable itinerary for design, art, architecture, fashion and long pauses.</p><p className="priority">Priority order: architecture, art, design and fashion. Cafés are optional.</p></section>
    <nav className="filters" aria-label="Trip site navigation"><button className={tab === 'itinerary' ? 'selected' : ''} onClick={() => setTab('itinerary')}>Itinerary</button><button className={tab === 'explore' ? 'selected' : ''} onClick={() => setTab('explore')}>Explore nearby</button><button className={tab === 'tips' ? 'selected' : ''} onClick={() => setTab('tips')}>Travel Tips</button></nav>
    {tab === 'itinerary' ? <>
      <nav className="subfilters" aria-label="Filter itinerary"><button className={active === 'All' ? 'selected' : ''} onClick={() => setActive('All')}>All days</button><button className={active === 'Silka' ? 'selected' : ''} onClick={() => setActive('Silka')}>Silka solo</button><button className={active === 'together' ? 'selected' : ''} onClick={() => setActive('together')}>Together</button></nav>
      <section id="content" className="itinerary"><div className="section-head"><p className="eyebrow">The plan</p><h2>One beautiful district at a time.</h2><p>Tap a map button on your phone; it opens the location in your chosen Korean navigation service.</p></div>{shown.map((day) => <article className="day-card" key={day.date + day.day}><header><div><p className="date">{day.date}</p><p className="day">{day.day}</p></div><h3>{day.theme}</h3></header><p className="description">{day.description}</p>{day.must && <p className="must"><span>Book / note</span>{day.must}</p>}<div className="stops">{day.stops.map((stop) => <div className="stop" key={stop.name}><div><h4>{stop.name}</h4><p>{stop.note}</p><code>{stop.korean}</code><div className="online-actions">{stop.booking && <a href={stop.booking} target="_blank">Official / booking ↗</a>}<a href={webSearch(`${stop.name} Seoul reviews official`)} target="_blank">Web & reviews ↗</a><a href={imageSearch(stop.name)} target="_blank">Image / Instagram search ↗</a></div><NoteBox placeKey={stop.name} notes={notes.filter((note) => note.place_key === stop.name)} onAdd={(author, body) => addNote(stop.name, author, body)} /></div><div className="map-actions"><a href={naver(stop.korean)} target="_blank">Naver Map ↗</a><a href={kakao(stop.korean)} target="_blank">KakaoMap ↗</a></div></div>)}</div></article>)}</section>
      <section className="need"><p className="eyebrow">Before leaving</p><h2>Book or download now</h2><ol><li><a href="https://audeum.org/booking" target="_blank">Audeum</a> · Sep 3</li><li><a href="https://ticket.leeum.org/leeum/personal/exhibitList.do" target="_blank">Leeum</a> and Gongi · Sep 1</li><li><a href="https://www.museumsan.org/eng/guidance/view_guide.jsp?m=5&s=2" target="_blank">Museum SAN Signature Pass</a> · Sep 2</li><li><a href="https://www.hanwhafireworks.com/" target="_blank">Orange Play Zone</a> · Sep 5</li><li><a href="https://apps.apple.com/us/app/hyundai-card-dive/id1469507774" target="_blank">Hyundai Card DIVE</a> · for Art Library entry</li></ol></section>
    </> : tab === 'explore' ? <section id="content" className="itinerary explore"><div className="section-head"><p className="eyebrow">Plan B, C & D</p><h2>Explore by district.</h2><p>These are the saved alternatives from the master list. Filter for where you are, then choose the kind of place you feel like seeing.</p></div><div className="explore-filters"><select value={district} onChange={(event) => setDistrict(event.target.value)} aria-label="Choose district">{districts.map((item) => <option key={item}>{item}</option>)}</select><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Choose category">{categories.map((item) => <option key={item}>{item}</option>)}</select></div><p className="result-count">{nearby.length} saved places</p><div className="explore-grid">{nearby.map((stop) => <article className="explore-card" key={stop.name}><p className="card-meta">{stop.district} · {stop.category}</p><h3>{stop.name}</h3><p>{stop.note}</p><code>{stop.korean}</code><div className="online-actions">{stop.booking && <a href={stop.booking} target="_blank">Official / booking ↗</a>}<a href={webSearch(`${stop.name} Seoul reviews official`)} target="_blank">Web & reviews ↗</a><a href={imageSearch(stop.name)} target="_blank">Image / Instagram search ↗</a></div><NoteBox placeKey={stop.name} notes={notes.filter((note) => note.place_key === stop.name)} onAdd={(author, body) => addNote(stop.name, author, body)} /><div className="map-actions"><a href={naver(stop.korean)} target="_blank">Naver Map ↗</a><a href={kakao(stop.korean)} target="_blank">KakaoMap ↗</a></div></article>)}</div></section> : <TravelTips />}
    <footer>Made for the trip · Keep this link pinned in Messages.</footer>
  </main>;
}
