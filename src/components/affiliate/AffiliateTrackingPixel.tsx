/**
 * A8.net等のアフィリエイト計測用1x1ピクセル画像
 * 視覚的には表示されないが、DOMにレンダリングされる
 */
interface Props {
  src?: string;
}

export function AffiliateTrackingPixel({ src }: Props) {
  if (!src) return null;
  return (
    <img
      src={src}
      width={1}
      height={1}
      alt=""
      aria-hidden="true"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        border: 0,
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}
