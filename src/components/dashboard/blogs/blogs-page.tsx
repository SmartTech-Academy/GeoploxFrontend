import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { PageMetaTags } from "@/components/page-meta-data";

const BlogsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Mock blog data
  const blogPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=300&fit=crop",
      category: "Market Trends",
      date: "Sunday, February 12, 2023",
      title: "How to position your team for success",
      excerpt:
        "In this article, we provide three tips on how we position our team for success consolidated in the 3 C's framework. In this article, we provide three tips on how we position our team for success consolidated in the 3 C's framework",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      category: "Market Trends",
      date: "Sunday, February 12, 2023",
      title: "The Top 10 Most Thoughtful Valentine's",
      excerpt: "We put together a list of 10 thoughtful gift ideas you can purchase righ...",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      category: "Market Trends",
      date: "Sunday, February 12, 2023",
      title: "The Top 10 Most Thoughtful Valentine's",
      excerpt: "We put together a list of 10 thoughtful gift ideas you can purchase righ...",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      category: "Market Trends",
      date: "Sunday, February 12, 2023",
      title: "The Top 10 Most Thoughtful Valentine's",
      excerpt: "We put together a list of 10 thoughtful gift ideas you can purchase righ...",
    },
  ];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-5 py-8">
      <PageMetaTags
        title="Blog Management"
        description="Create and manage blog content to engage with your audience and share real estate insights."
        keywords="blog management, content creation, real estate blogging"
      />
      <div className="w-full">
        <div className="mx-auto flex w-full px-4 md:px-8">
          {/* Main Content */}
          <div className="flex w-full flex-col items-start gap-8">
            {/* Header Section */}
            <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-6">
              <div className="flex w-full flex-col items-start gap-3 md:w-auto md:flex-row md:items-center">
                {/* Search Input */}
                <div className="relative w-full md:w-auto">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Search blog"
                    className="h-10 w-full rounded-xl border border-[#D5D5DD] pr-4 pl-10 md:w-[339px]"
                  />
                </div>

                <Select defaultValue="all" name="blog-category-select">
                  <SelectTrigger className="h-10 min-w-[198px] rounded-xl border-[#D5D5DD] bg-white text-[#41415A] focus:ring-0">
                    <div className="flex items-center gap-2">
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="market">Market Trends</SelectItem>
                    <SelectItem value="investment">Investment Tips</SelectItem>
                    <SelectItem value="property">Property News</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* New Post Button */}
              <Button
                asChild
                style={{
                  background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                  boxShadow:
                    "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                }}
                className="h-10 rounded-[40px] border border-[oklch(0.235_0_0/50%)] px-6 text-[14px] leading-[17px] font-semibold text-white"
              >
                <Link to="/blogs/create">New Post</Link>
              </Button>
            </div>

            {/* Blog Grid */}
            <div className="flex w-full flex-col items-start gap-6 self-stretch">
              <h1 className="text-[24px] leading-[34px] font-semibold tracking-[-0.39px] text-black">
                All Blog Posts
              </h1>
              <div className="flex w-full flex-col gap-10 self-stretch">
                {/* Featured Post */}
                <div className="flex w-full flex-col items-center gap-4 self-stretch rounded-sm border border-[#F1F1F1] md:flex-row md:gap-8">
                  <img
                    src={blogPosts[0].image}
                    alt="Featured post"
                    width={552}
                    height={255}
                    className="h-[200px] w-full rounded-t object-cover md:h-[255px] md:max-w-1/2 md:rounded-none md:rounded-l"
                  />
                  <div className="flex flex-col p-4 pr-3 md:p-0">
                    <div className="flex items-center gap-3">
                      <p className="text-[15px]/5 tracking-[-0.12px] text-[#060809]">
                        {blogPosts[0].category}
                      </p>

                      <p className="text-[15px]/5 tracking-[-0.12px] text-[#7B828E]">
                        {blogPosts[0].date}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 self-stretch">
                      <h2 className="text-[24px] leading-[34px] font-semibold tracking-[-0.39px] text-black">
                        {blogPosts[0].title}
                      </h2>

                      <p className="text-[15px] leading-[21px] tracking-[-0.12px] text-[#71748C]">
                        {blogPosts[0].excerpt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid Posts */}
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {blogPosts.slice(1).map((post) => (
                    <div
                      key={post.id}
                      className="flex w-full flex-col gap-4 rounded-xl border border-[#E9EBEC]"
                    >
                      <img
                        width={362}
                        height={240}
                        src={post.image}
                        alt={post.title}
                        className="h-[240px] w-full rounded-t-[8px] object-cover"
                      />
                      <div className="flex flex-col gap-3 px-4 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <p className="text-[15px]/5 tracking-[-0.12px] text-[#060809]">
                              {post.category}
                            </p>

                            <p className="text-[15px]/5 tracking-[-0.12px] text-[#7B828E]">
                              {post.date}
                            </p>
                          </div>
                        </div>
                        <h3 className="text-[18px] leading-[26px] font-semibold tracking-[-0.2px] text-[#060809]">
                          {post.title}
                        </h3>
                        <p className="line-clamp-2 text-[15px] leading-[21px] tracking-[-0.12px] text-[#71748C]">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex w-full items-center justify-center gap-2 self-stretch">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="size-8 rounded-[4px] p-0"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`size-8 rounded-[4px] p-0 text-[12px] ${
                        currentPage === page
                          ? "bg-[#1F2130] text-white hover:bg-[#1F2130]"
                          : "text-[#71748C] hover:text-[#1F2130]"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}

                  <span className="mx-2 text-[12px] text-[#71748C]">of {totalPages}</span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="size-8 rounded-[4px] p-0"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
