import CreateBlogForm from './create-blog-form';
import { PageMetaTags } from '@/components/page-meta-data';

const CreateBlogs = () => {
  return (
    <div className="w-full">
      <PageMetaTags
        title="Create New Blog Post"
        description="Write and publish new blog content to share insights and attract potential clients."
        keywords="create blog post, content writing, real estate content"
      />
      <CreateBlogForm />
    </div>
  );
};

export default CreateBlogs;
