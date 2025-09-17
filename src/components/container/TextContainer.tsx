import clsx from "clsx";

interface TextContainerProps {
  children: React.ReactNode;
  className?: string; // ✅ 외부에서 width 같은 스타일 추가 가능
}

const TextContainer = ({ children, className }: TextContainerProps) => {
  return (
    <div
      className={clsx(
        "rounded-[12px] bg-[#2C2C2C] text-[#9CA3AF] p-4",
        "overflow-hidden box-border", // ✅ tailwind에서 한 줄 ellipsis
        className
      )}
    >
        {children}
    </div>
  );
};

export default TextContainer;