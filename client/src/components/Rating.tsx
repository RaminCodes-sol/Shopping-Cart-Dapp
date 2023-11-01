import { AiFillStar, AiOutlineStar } from "react-icons/ai"



const Rating = ({ rating }: { rating: number}) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<span key={i} className="text-[gold]"><AiFillStar /></span>);
    } else {
      stars.push(<span key={i}><AiOutlineStar /></span>);
    }
  }
  return <div className="flex">{stars}</div>;
}

export default Rating