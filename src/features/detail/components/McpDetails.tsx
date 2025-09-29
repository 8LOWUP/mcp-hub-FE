import TextContainer from "@/components/container/TextContainer";
import Image from "next/image";
import { McpDetail } from "../hooks/types";

interface Props {
    data: McpDetail;
}

export default function McpDetails({ data }: Props) {
    return (
        <>
            <div className="text-secondary font-semibold text-lg">Details</div>
            <TextContainer className="w-full">
                <div className="space-y-5">
                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Developer Name</div>
                        <div className="text-white">{data.developerName}</div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Published</div>
                        <div className="text-white">{data.published}</div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Source Code</div>
                        <div>
                            <a
                                href={data.sourceCode}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-white space-x-2 hover:underline"
                            >
                                <span>{data.sourceCode}</span>
                                <Image src="/sourceCode.svg"
                                       alt="Source Code Icon"
                                       width={10} height={10}
                                       className="w-4 h-4 transition-transform duration-300 ease-in-out hover:scale-125" />
                            </a>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-secondary">License</div>
                        <div className="text-white">{data.license}</div>
                    </div>
                </div>
            </TextContainer>
        </>
    );
}
