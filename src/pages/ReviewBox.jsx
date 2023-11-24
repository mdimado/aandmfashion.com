import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const ReviewBox = ({ productId }) => {
  const user = useSelector((state) => state.auth.user);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const submitReview = async () => {
    if (!user) {
        toast.error("You need to be logged in to submit a review.");
        return;
    }

    if (rating === 0 || review.trim() === "") {
        toast.error("Please provide a rating and a review.");
        return;
    }

    const reviewData = {
      userId: user.id,
      rating,
      review,
      createdAt: serverTimestamp(),
    };

    try {
      const reviewsRef = collection(db, "products", productId, "reviews");
      await addDoc(reviewsRef, reviewData);
      // You can update the reviews state or perform other actions here
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  return (
    <div className="review-box">
      <h3>Add a Review</h3>
      <div className="rating">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={index < rating ? "active" : ""}
            onClick={() => handleRatingChange(index + 1)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
};

export default ReviewBox;
