import { useState } from "react";
import { CommunityPost } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface PostCardProps {
  post: CommunityPost & {
    user?: {
      id: number;
      username: string;
      fullName: string;
      apartmentNumber?: string;
    };
    tags?: string[];
    userLiked?: boolean;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(post.userLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const formatTimeAgo = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const formatEventDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    return format(new Date(date), "E, MMM d • h:mm a");
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleLikeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await apiRequest("POST", `/api/posts/${postId}/like`, {});
      return res.json();
    },
    onSuccess: (data) => {
      setLiked(data.liked);
      setLikesCount(data.post.likesCount);
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return;
    }
    toggleLikeMutation.mutate(post.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex space-x-3 mb-3">
        <Avatar>
          <AvatarFallback className="bg-accent text-white">
            {post.user ? getInitials(post.user.fullName) : "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{post.user?.fullName || "Unknown User"}</h4>
          <p className="text-text-secondary text-sm">
            {formatTimeAgo(post.createdAt)} 
            {post.user?.apartmentNumber && ` • Apt #${post.user.apartmentNumber}`}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <p className="mb-3">{post.content}</p>
        
        {post.isEvent && post.eventTitle && (
          <div className="relative rounded-lg overflow-hidden mb-3">
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt={post.eventTitle} 
                className="w-full h-48 object-cover" 
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div className="text-white font-medium">{post.eventTitle}</div>
              <div className="text-white/90 text-sm">{formatEventDate(post.eventDate)}</div>
            </div>
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-text-secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center space-x-1 ${liked ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
            onClick={handleLike}
          >
            <i className={`${liked ? 'ri-thumb-up-fill' : 'ri-thumb-up-line'}`}></i>
            <span>{likesCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1 text-text-secondary hover:text-primary"
          >
            <i className="ri-chat-1-line"></i>
            <span>{post.commentsCount}</span>
          </Button>
        </div>
        
        {post.isEvent && (
          <Link href={`/community/event/${post.id}`}>
            <Button size="sm" className="bg-primary text-white">
              RSVP
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
