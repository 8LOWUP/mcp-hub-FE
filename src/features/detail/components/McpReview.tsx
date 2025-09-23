import TextContainer from "@/components/container/TextContainer";
import { Review } from "../hooks/types";

interface Props {
    reviews: Review[];
}

export default function MarketReviews({ reviews }: Props) {
    return (
        <div>
            <div className="text-secondary">Reviews</div>
            <TextContainer className="w-full flex flex-col gap-2">
                {reviews.map((review) => (
                    <div key={review.id}>
                        {review.author}: {review.content} ({review.rating}★)
                    </div>
                ))}
            </TextContainer>
        </div>
    );
}
