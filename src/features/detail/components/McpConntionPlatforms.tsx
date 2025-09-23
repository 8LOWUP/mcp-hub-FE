import TextContainer from "@/components/container/TextContainer";
import Image from "next/image";

interface Props {
    platforms: string[];
}

export default function MarketConnectionPlatforms({ platforms }: Props) {
    const platformIconMap: Record<string, string> = {
        Youtube: "/youtube.svg",
        Notion: "/notion.svg",
        Google: "/google.svg",
        Vscode: "/vscode.svg",
    };

    return (
        <div className="info-block">
            <div className="text-secondary">Connection Platform</div>
            <TextContainer className="w-full flex flex-wrap gap-2 items-center">
                {platforms.map((platform, idx) => {
                    const iconSrc = platformIconMap[platform] || "/default.svg";
                    return (
                        <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded">
                            <Image src={iconSrc} alt={platform} width={20} height={20} />
                        </div>
                    );
                })}
            </TextContainer>
        </div>
    );
}
