type CountryFlagProps = {
  code: string;
  size?: number;
  className?: string;
};

export function getCountryFlagUrl(code: string, width: 40 | 80 = 40) {
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;
}

export function CountryFlag({
  code,
  size = 20,
  className,
}: CountryFlagProps) {
  const height = Math.round(size * 0.75);

  return (
    <img
      src={getCountryFlagUrl(code, 40)}
      srcSet={`${getCountryFlagUrl(code, 80)} 2x`}
      width={size}
      height={height}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={className}
      style={{
        objectFit: "cover",
        borderRadius: 2,
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}
