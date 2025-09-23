import TextContainer from "@/components/container/TextContainer";

interface Props {
    tools: string[];
}

export default function MarketTools({ tools }: Props) {
    return (
        <>
            <div className="text-secondary">Tools</div>
            <TextContainer className="w-full flex flex-wrap gap-2">
                {tools.map((tool, idx) => (
                    <div key={idx}>{tool}</div>
                ))}
            </TextContainer>
        </>
    );
}
