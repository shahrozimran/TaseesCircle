// Mirror the unoptimized brand images in the isolated browser fixture.
export default function Image({ src, alt, width, height, className, loading, draggable }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={width} height={height} className={className} loading={loading} draggable={draggable} />;
}
