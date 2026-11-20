/* eslint-disable @next/next/no-img-element */
import {
  TOURRADAR_REVIEWS_URL,
  TOURRADAR_WRITE_REVIEW_URL,
  type TourRadarSummary,
} from "./tourradar-types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return y && m ? `${MONTHS[m - 1]} ${y}` : "";
}

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="tr-stars" role="img" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(full)}
      <span className="tr-stars__empty">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export function TourRadarWidget({ data, className }: { data: TourRadarSummary; className?: string }) {
  return (
    <div className={`tr-widget${className ? ` ${className}` : ""}`}>
      <div className="tr-widget__head">
        <a href="https://www.tourradar.com/" target="_blank" title="TourRadar" rel="noopener">
          <div className="tr-widget__logo" />
        </a>
        <a href={TOURRADAR_WRITE_REVIEW_URL} target="_blank" rel="noopener">
          <div className="tr-widget__write">
            <span>Leave a review</span>
          </div>
        </a>
      </div>
      <a className="tr-widget__summary" href={TOURRADAR_REVIEWS_URL} target="_blank" rel="noopener">
        <strong className="tr-widget__score">{data.rating.toFixed(1)}</strong>
        <span>
          <Stars value={data.rating} />
          <span className="tr-widget__count">
            based on <strong>{data.reviewCount} reviews</strong>
          </span>
        </span>
      </a>
      <div className="tr-widget__list">
        {data.reviews.map((review) => (
          <div key={review.id} className="tr-review">
            <div className="tr-review__head">
              {review.avatar ? (
                <img className="tr-review__avatar" src={review.avatar} alt="" width={36} height={36} loading="lazy" />
              ) : (
                <span className="tr-review__avatar tr-review__avatar--initial" aria-hidden="true">
                  {review.author.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="tr-review__meta">
                <span className="tr-review__name">{review.author}</span>
                <span className="tr-review__date">{formatDate(review.date)}</span>
              </div>
              <Stars value={review.rating} />
            </div>
            <a className="tr-review__tour" href={review.tourUrl} target="_blank" rel="noopener">
              {review.tourTitle}
            </a>
            <p className="tr-review__text">{review.text}</p>
          </div>
        ))}
        <a className="tr-widget__all" href={TOURRADAR_REVIEWS_URL} target="_blank" rel="noopener">
          Read all {data.reviewCount} reviews on TourRadar
        </a>
      </div>
    </div>
  );
}
