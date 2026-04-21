import { PageMetaTags } from "@/components/page-meta-data";
import PropertyForm from "./property-form";

const PropertiesCreate = () => {
  return (
    <>
      <PageMetaTags
        title="List New Property"
        description="Add a new property to your portfolio. Upload photos, set pricing, and reach potential buyers or tenants."
        keywords="list property, add new listing, property upload"
      />
      <PropertyForm />
    </>
  );
};

export default PropertiesCreate;
