
-- Drop the overly permissive insert policy and recreate with length checks
DROP POLICY "Anyone can submit" ON public.submissions;
CREATE POLICY "Anyone can submit" ON public.submissions 
  FOR INSERT WITH CHECK (
    length(product_name) > 0 AND length(product_name) <= 200
    AND length(website_url) > 0 AND length(website_url) <= 500
    AND length(email) > 0 AND length(email) <= 320
  );
