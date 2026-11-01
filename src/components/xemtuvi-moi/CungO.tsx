import type { CungView } from '@/lib/xemtuvi-moi/view';

export function CungO({ cung, chon, onChon }: { cung: CungView; chon?: boolean; onChon?: (chi: number) => void }) {
  const nhan = `Cung ${cung.ten}, ${cung.can} ${cung.tenChi}`;
  return (
    <button type="button" className="xtv-cung" data-chi={cung.chi} data-menh={cung.laMenh || undefined}
      aria-pressed={chon ?? false} aria-label={nhan} onClick={() => onChon?.(cung.chi)} style={{ textAlign: 'left', font: 'inherit', cursor: onChon ? 'pointer' : 'default' }}>
      <span className="xtv-cung-ten">{cung.ten}{cung.laThan ? ' · Thân' : ''}</span>{' '}
      <span className="xtv-cung-chi">{cung.can} {cung.tenChi}</span>
      {cung.chinhTinh.map((s) => <Sao key={s.ten} s={s} />)}
      <span className="xtv-phu">{cung.phuTinh.slice(0, 6).map((s) => <Sao key={s.ten} s={s} />)}</span>
      {(cung.tuan || cung.triet) && <span className="xtv-sao" data-hanh="Thổ">{[cung.tuan && 'Tuần', cung.triet && 'Triệt'].filter(Boolean).join(' · ')}</span>}
    </button>
  );
}

function Sao({ s }: { s: CungView['chinhTinh'][number] }) {
  return (
    <span className="xtv-sao" data-hanh={s.hanh} data-loai={s.loai} data-sang={s.sang ?? undefined}>
      {s.ten}{s.sang ? ` (${s.sang})` : ''}{s.hoa ? ` · Hóa ${s.hoa}` : ''}
    </span>
  );
}
