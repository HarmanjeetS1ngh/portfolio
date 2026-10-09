import Icon from './Icon.jsx';
import { recon } from '../content.js';

function Column({ data, tone }) {
  const isDoes = tone === 'does';
  return (
    <div className="flex flex-col gap-3">
      <div
        className={`flex items-center justify-between gap-3 rounded-xl px-6 py-[22px] font-mono-ui text-sm leading-tight font-bold tracking-[0.06em] text-white uppercase ${
          isDoes ? 'bg-accent' : 'bg-bad'
        }`}
      >
        {data.title}
        <Icon name={data.icon} size={30} className="shrink-0 opacity-55" />
      </div>
      <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
        {data.items.map((item) => (
          <div
            key={item.text}
            className={`flex flex-col items-center justify-start gap-3.5 rounded-xl border px-3.5 pt-6 pb-[22px] text-center font-body text-sm leading-[1.45] font-medium text-ink min-[380px]:min-h-[132px] ${
              isDoes ? 'border-accent/20 bg-accent-soft' : 'border-bad/20 bg-bad-bg'
            }`}
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                isDoes ? 'bg-accent/15 text-accent-dark' : 'bg-bad/15 text-bad'
              }`}
            >
              <Icon name={item.icon} size={20} />
            </span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Recon() {
  return (
    <div className="mt-10 mb-10 grid grid-cols-1 items-start gap-5 md:grid-cols-2">
      <Column data={recon.does} tone="does" />
      <Column data={recon.wont} tone="wont" />
    </div>
  );
}
