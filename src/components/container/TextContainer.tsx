import clsx from "clsx";

interface TextContainerProps {
  children: React.ReactNode;
  className?: string; // ✅ 외부에서 width 같은 스타일 추가 가능
  textColor?: string;
}

const TextContainer = ({ children, className, textColor }: TextContainerProps) => {
  return (
    <div
      className={clsx(
        "rounded-[12px] bg-surface-2 text-[#9CA3AF] p-4",
        "overflow-hidden box-border", // ✅ tailwind에서 한 줄 ellipsis
        className,
        textColor
      )}
    >
        {children}
    </div>
  );
};

export default TextContainer;