import Image from "next/image";
import type { ReferenceLogo } from "@/data/references";

type ReferenceLogoItemProps = {
  logo: ReferenceLogo;
  width?: number;
  height?: number;
  wrapperClassName?: string;
  imageClassName?: string;
};

export default function ReferenceLogoItem({
  logo,
  width = 160,
  height = 64,
  wrapperClassName = "",
  imageClassName = "max-h-full w-auto max-w-full object-contain",
}: ReferenceLogoItemProps) {
  const image = (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={width}
      height={height}
      className={imageClassName}
    />
  );

  if (logo.href) {
    return (
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${logo.alt} web sitesi`}
        className={`transition-opacity hover:opacity-80 ${wrapperClassName}`}
      >
        {image}
      </a>
    );
  }

  return <div className={wrapperClassName}>{image}</div>;
}
