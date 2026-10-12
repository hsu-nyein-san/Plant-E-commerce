import { Star } from 'lucide-react';
import React from 'react';

const ReviewsSection = () => {
    const reviews = [
        {
            id: 1,
            name: "Alsha Ramirez",
            date: "April 12, 2026",
            rating: 5,
            text: "Healthy plant arrived with large leaves and minimal transplant shock. Arrived quickly and well packaged.",
            initials: "AR",
            color: "bg-emerald-100 text-emerald-700"
        },
        {
            id: 2,
            name: "Marcus Bennett",
            date: "March 28, 2026",
            rating: 4,
            text: "Great foliage but a couple of leaves had minor browning — likely transit stress. Bounced back after a week.",
            initials: "MB",
            color: "bg-orange-100 text-orange-700"
        }
    ];

    return (
        <div className="mt-4 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h3>
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${review.color}`}>
                            {review.initials}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{review.name}</p>
                                    <p className="text-xs text-gray-500">{review.date}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-sm">{review.rating.toFixed(1)}</span>
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={12} 
                                                fill={i < Math.floor(review.rating) ? "currentColor" : "none"} 
                                                className={i < Math.floor(review.rating) ? "" : "text-gray-300"} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">"{review.text}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsSection;