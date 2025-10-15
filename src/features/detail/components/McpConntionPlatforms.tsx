import TextContainer from "@/components/container/TextContainer";
import Image from "next/image";
import imageLoader from "@/lib/imageLoader";

interface Props {
    platforms: string[];
}

export default function MarketConnectionPlatforms({ platforms }: Props) {
    const platformIconMap: Record<string, string> = {
        Youtube: "/youtube.svg",
        Notion: "/notionLogo.svg",
        Google: "/google.svg",
        Vscode: "/vscode.svg",
        Instagram: "/instagram.svg",
    };

    return (
        <div className="info-block">
            <div className="text-secondary font-semibold text-lg mb-4">Connection Platform</div>
            <TextContainer className="w-full flex flex-wrap gap-2 items-center">
                {platforms.map((platform, idx) => {
                    const iconSrc = platformIconMap[platform] || "/default.svg";
                    return (
                        <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded">
                            <Image src={iconSrc} alt={platform} width={40} height={40} loader={imageLoader} unoptimized />
                        </div>
                    );
                })}
            </TextContainer>
        </div>
    );
}
