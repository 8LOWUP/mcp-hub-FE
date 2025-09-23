import TextContainer from "@/components/container/TextContainer";
import { McpDetail } from "../hooks/types";

interface Props {
    about: McpDetail["about"];
}

export default function McpAbout({ about }: Props) {
    return (
        <>
            <div className="text-secondary">About</div>
            <TextContainer className="w-full">{about}</TextContainer>
        </>
    );
}
