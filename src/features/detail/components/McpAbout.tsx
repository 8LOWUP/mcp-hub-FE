import TextContainer from "@/components/container/TextContainer";
import { McpDetail } from "../hooks/types";

interface Props {
    about: McpDetail["about"];
}

export default function McpAbout({ about }: Props) {
    return (
        <>
            <div className="text-secondary font-semibold text-lg">About</div>
            <TextContainer className="w-full border border-contrast text-left tracking-wide leading-relaxed text-white">{about}</TextContainer>
        </>
    );
}
