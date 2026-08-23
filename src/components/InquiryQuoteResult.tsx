import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const canadaEastQuoteOptions = [
  { service: '加拿大加东直航30日达', price: '¥31.9/KG' },
  { service: '加拿大加东直航33日达', price: '¥31.3/KG' },
  { service: '加东-美转加25日达', price: '¥33.8/KG' },
  { service: '加东-美转加20日达', price: '¥34.6/KG' },
  { service: '加东-美转加19日达', price: '¥35.8/KG' },
];

export const CANADA_EAST_QUOTE_RESULT = canadaEastQuoteOptions
  .map(({ service, price }) => `${service}\t${price}`)
  .join('\n');

export default function InquiryQuoteResult({ value }: { value: string }) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<{ left: number; top?: number; bottom?: number } | null>(null);

  if (!value) return <span>-</span>;

  const quoteLines = value.split('\n').map((line) => {
    const [service, price] = line.split('\t');
    return { service, price };
  });
  const preview = quoteLines.map(({ service, price }) => [service, price].filter(Boolean).join(' ')).join('；');

  const showTooltip = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const margin = 12;
    const tooltipWidth = Math.min(420, window.innerWidth - margin * 2);
    const left = Math.min(Math.max(margin, rect.left), window.innerWidth - tooltipWidth - margin);
    const showAbove = window.innerHeight - rect.bottom < 190 && rect.top > window.innerHeight - rect.bottom;
    setTooltipStyle(showAbove
      ? { left, bottom: window.innerHeight - rect.top + 8 }
      : { left, top: rect.bottom + 8 });
  };

  return (
    <>
      <span
        ref={triggerRef}
        tabIndex={0}
        className='block max-w-full cursor-default truncate outline-none focus:ring-2 focus:ring-blue-200'
        onMouseEnter={showTooltip}
        onMouseLeave={() => setTooltipStyle(null)}
        onFocus={showTooltip}
        onBlur={() => setTooltipStyle(null)}
      >
        {preview}
      </span>
      {tooltipStyle && createPortal(
        <div
          role='tooltip'
          className='pointer-events-none fixed z-[100] w-[420px] max-w-[calc(100vw-24px)] rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-xl'
          style={tooltipStyle}
        >
          <div className='mb-2 font-semibold text-slate-800'>报价结果</div>
          <div className='space-y-1'>
            {quoteLines.map(({ service, price }, index) => (
              <div key={`${service}-${index}`} className='flex items-baseline justify-between gap-4 whitespace-nowrap'>
                <span>{service}</span>
                {price && <span className='font-semibold text-slate-800'>{price}</span>}
              </div>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
