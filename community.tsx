import { useState, FormEvent } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import PostCard from "@/components/post-card";
import { CommunityPost } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function Community() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [postContent, setPostContent] = useState("");
  const [isEvent, setIsEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch community posts
  const { data: posts, isLoading: postsLoading } = useQuery<CommunityPost[]>({
    queryKey: ["/api/posts"],
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const res = await apiRequest("POST", "/api/posts", postData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Post created!",
        description: "Your post has been published to the community.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      resetForm();
      setIsSubmitting(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Post failed",
        description: error.message || "There was a problem creating your post.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const resetForm = () => {
    setPostContent("");
    setIsEvent(false);
    setEventTitle("");
    setEventDate("");
    setTagInput("");
    setTags([]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to create a post",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!postContent.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something in your post",
        variant: "destructive",
      });
      return;
    }
    
    if (isEvent && (!eventTitle.trim() || !eventDate)) {
      toast({
        title: "Missing event details",
        description: "Please provide a title and date for your event",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const postData = {
      content: postContent.trim(),
      isEvent,
      tags,
      ...(isEvent && {
        eventTitle: eventTitle.trim(),
        eventDate: new Date(eventDate),
      }),
    };
    
    createPostMutation.mutate(postData);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-6 pb-20 md:pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Community</h1>
      
      {/* New Post Form */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-white">
                {user ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={2}
                placeholder={isAuthenticated ? "Share something with your neighbors..." : "Login to post in the community..."}
                className="w-full resize-none mb-3"
                disabled={!isAuthenticated || isSubmitting}
              />
              
              {/* Event toggle */}
              <div className="flex items-center mb-3">
                <Switch
                  checked={isEvent}
                  onCheckedChange={setIsEvent}
                  disabled={!isAuthenticated || isSubmitting}
                />
                <span className="ml-2 text-sm text-text-secondary">This is an event</span>
              </div>
              
              {/* Event fields */}
              {isEvent && (
                <div className="mb-3 space-y-2">
                  <Input
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Event title"
                    disabled={isSubmitting}
                  />
                  <Input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              )}
              
              {/* Tags input */}
              <div className="mb-3">
                <div className="flex mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags (press Enter)"
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    disabled={!isAuthenticated || isSubmitting}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleAddTag}
                    disabled={!isAuthenticated || isSubmitting || !tagInput.trim()}
                    className="ml-2"
                  >
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive focus:outline-none"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button type="button" variant="ghost" size="icon" disabled={!isAuthenticated || isSubmitting}>
                    <i className="ri-image-line text-text-secondary"></i>
                  </Button>
                  <Button type="button" variant="ghost" size="icon" disabled={!isAuthenticated || isSubmitting}>
                    <i className="ri-question-line text-text-secondary"></i>
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white" 
                  disabled={!isAuthenticated || isSubmitting || !postContent.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i> Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Community Posts */}
      <div className="space-y-4">
        {postsLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex space-x-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-4 w-full max-w-[70%] mb-2" />
              <Skeleton className="h-4 w-full max-w-[40%]" />
            </div>
          ))
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500">No posts in the community yet</p>
            <p className="text-gray-500 mt-2">Be the first to post!</p>
          </div>
        )}
      </div>
    </main>
  );
}
