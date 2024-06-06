import { Separator } from "@/components/ui/separator";
import { type FC, memo, Suspense } from "react";
import { PhUser } from "~/integrations/react/icons/Phosphor";
import type { Review } from "~/modules/property/model/types";

interface ReviewListProps {
  reviews: Review[];
}

interface ReviewCardProps {
  review: Review;
}

const StarIcon: FC<{ fill: string }> = ({ fill }) => (
  <svg
    className={`w-4 h-4 ${fill}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 22 20"
  >
    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
  </svg>
);

const ReviewCard: FC<ReviewCardProps> = memo(({ review }) => {
  const { content, rating, created_at, user } = review;

  return (
    <article className="mt-3 first:mt-0">
      <div className="flex items-center mb-4 space-x-4">
        {user.profile_image_id ? (
          <img
            className="w-10 h-10 rounded-full"
            src={user.profile_image_id}
            alt={user.name}
            width={32}
            height={32}
          />
        ) : (
          <PhUser className="w-10 h-10 rounded-full" />
        )}
        <div className="space-y-1 font-medium dark:text-white">
          <p>
            {user.name}{" "}
            <time
              dateTime={created_at}
              className="block text-sm text-gray-500 dark:text-gray-400"
            >
              <Suspense>
                Reviewed on {new Date(created_at).toLocaleDateString()}
              </Suspense>
            </time>
          </p>
        </div>
      </div>
      <div className="flex items-center mb-1">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            fill={
              i < rating
                ? "text-yellow-300 mr-1"
                : "text-gray-300 dark:text-gray-500 mr-1"
            }
          />
        ))}
      </div>
      <p className="mb-2 text-gray-500 dark:text-gray-400">{content}</p>
      <Separator />
    </article>
  );
});

export const ReviewList: FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
