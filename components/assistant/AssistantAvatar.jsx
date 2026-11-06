import Image from "next/image";

export default function AssistantAvatar({ size = "normal" }) {
  const isLarge = size === "large";

  return (
    <div
      className={`
        grid shrink-0 place-items-center
        rounded-full bg-white shadow-soft
        ${isLarge ? "size-14" : "size-10"}
      `}
    >
      <Image
        src="/images/logo.svg"
        alt="Logo AIRA"
        width={isLarge ? 38 : 28}
        height={isLarge ? 38 : 28}
        className="object-contain"
        priority={isLarge}
      />
    </div>
  );
} 