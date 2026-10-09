import { Fragment } from 'react';
import Icon from './Icon.jsx';
import { chain } from '../content.js';

export default function ProcessChain() {
  return (
    <div className="chain-scroll mt-10 mb-10 flex items-center justify-center gap-1 overflow-x-auto px-1 py-7">
      {chain.map((node, i) => (
        <Fragment key={node.label}>
          {i > 0 && <Icon name="ArrowRight" size={18} className="-mt-[22px] shrink-0 text-ink-3" />}
          <div className="flex w-[108px] shrink-0 flex-col items-center gap-2.5 text-center">
            <div
              className={`flex size-12 items-center justify-center rounded-full border ${
                node.highlight ? 'border-accent bg-accent text-white' : 'border-line-soft bg-surface-1 text-ink'
              }`}
            >
              <Icon name={node.icon} size={22} />
            </div>
            <span
              className={`font-mono-ui text-[11px] leading-[1.3] font-bold tracking-[0.02em] uppercase ${
                node.highlight ? 'text-accent' : 'text-ink-2'
              }`}
            >
              {node.label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
