import Link from "next/link";
import { User, Clock } from "lucide-react";

interface PostCardProps {
  id: string;
  name: string;
  userId: string;
  timestamp: string;
  content: string;
}

const PostCard = ({ id, name, userId, timestamp, content }: PostCardProps) => {
  return (
    <div className="bg-white border-4 border-gray-900 rounded-xl shadow-brutalist-lg p-6 mb-6 transition-all hover:shadow-2xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-indigo-200 border-4 border-gray-900 rounded-full shadow-brutalist-sm flex items-center justify-center">
          <User size={24} className="text-indigo-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/profile/${userId}`}
              className="font-black text-indigo-700 hover:text-pink-600 transition-colors"
            >
              {name}
            </Link>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Clock size={14} />
              {timestamp}
            </div>
          </div>
          <p className="text-gray-800 font-semibold leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
