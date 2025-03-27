import { csrfFetch } from "./csrf";
// import { createSelector } from "reselect";

//> action types:
const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";
const ADD_REVIEW = "reviews/ADD_REVIEW";
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";
const UPDATE_REVIEW = "reviews/UPDATE_REVIEW";
const CLEAR_SPOT_REVIEWS = "reviews/CLEAR_SPOT_REVIEWS";
const UPDATE_SPOT_DETAILS = "reviews/UPDATE_SPOT_DETAILS";

//> action creators
const loadReviews = (reviews) => ({
	type: LOAD_REVIEWS,
	reviews,
});

const addReviewAction = (review) => ({
	type: ADD_REVIEW,
	review,
});

const updateReviewAction = (review) => ({
	type: UPDATE_REVIEW,
	review,
});

const removeReview = (reviewId) => ({
	type: REMOVE_REVIEW,
	reviewId,
});

export const clearSpotReviews = () => ({
	type: CLEAR_SPOT_REVIEWS,
});

const updateSpotDetails = (spotId, spotData) => ({
	type: UPDATE_SPOT_DETAILS,
	payload: { spotId, ...spotData },
});

//- thunks
export const fetchSpotReviews = (spotId) => async (dispatch) => {
	console.log("fetchSpotReviews called with spotId:", spotId);
	const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
	if (res.ok) {
		const data = await res.json();
		dispatch(loadReviews(data.Reviews));
	}
};

export const addReview = (spotId, review) => async (dispatch) => {
	const reviewPayload = { ...review, stars: parseInt(review.stars, 10) };

	const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(reviewPayload),
	});
	if (res.ok) {
		const { newReview, spot } = await res.json();
		dispatch(addReviewAction(newReview));
		dispatch(updateSpotDetails(spotId, spot));
		dispatch(fetchSpotReviews(spotId));
	}
};

export const updateReview = (reviewId, reviewData) => async (dispatch) => {
	const res = await csrfFetch(`/api/reviews/${reviewId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(reviewData),
	});

	if (res.ok) {
		const updatedReview = await res.json();
		dispatch(updateReviewAction(updatedReview));
		return updatedReview;
	}
};
// console.log("Spot ID before dispatching deleteReview:", spotId);
export const deleteReview = (reviewId, spotId) => async (dispatch) => {
	console.log(
		"deleteReview called with reviewId:",
		reviewId,
		"spotId:",
		spotId
	);
	const response = await csrfFetch(`/api/reviews/${reviewId}`, {
		method: "DELETE",
	});

	if (response.ok) {
		// const { spot } = await response.json();
		dispatch(removeReview(reviewId));
		// dispatch(updateSpotDetails(spotId, spot));
		dispatch(fetchSpotReviews(spotId));
	}
};

//* reducer:
const initialState = { spotReviews: {} };

export default function reviewsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_REVIEWS: {
			if (!action.reviews) {
				console.error("No reviews found in action payload");
				return state;
			}
			const newReviews = {};
			action.reviews
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort reviews by date (newest first)
				.forEach((review) => {
					newReviews[review.id] = review;
				});
			return { ...state, spotReviews: newReviews };
		}
		case ADD_REVIEW:
			return {
				...state,
				spotReviews: {
					...state.spotReviews,
					[action.review.id]: action.review,
				},
			};
		case REMOVE_REVIEW: {
			const newState = { ...state, spotReviews: { ...state.spotReviews } };
			if (action.reviewId in newState.spotReviews) {
				delete newState.spotReviews[action.reviewId];
			} else {
				console.warn(`Review ID ${action.reviewId} not found in spotReviews`);
			}
			return newState;
		}
		case UPDATE_REVIEW:
			return {
				...state,
				spotReviews: {
					...state.spotReviews,
					[action.review.id]: action.review,
				},
			};
		case CLEAR_SPOT_REVIEWS:
			return { ...state, spotReviews: {} };
		case UPDATE_SPOT_DETAILS: {
			const { spotId, numReviews, avgRating } = action.payload;

			return {
				...state,
				allSpots: {
					...state.allSpots,
					[spotId]: {
						...(state.allSpots?.[spotId] || {}),
						numReviews,
						avgRating,
					},
				},
				singleSpot: {
					...(state.singleSpot || {}),
					avgRating: avgRating ? parseFloat(avgRating) : null,
					numReviews,
				},
			};
		}

		default:
			return state;
	}
}
