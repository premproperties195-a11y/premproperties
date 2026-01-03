-- ================================================
-- ENHANCED ROW LEVEL SECURITY (RLS) POLICIES
-- Secure database access with proper authentication
-- ================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ================================================
-- ADMIN USERS POLICIES
-- ================================================

-- Admin users can only read their own data when authenticated
CREATE POLICY "Admin users can read own data"
ON public.admin_users FOR SELECT
USING (auth.uid()::text = id);

-- Service role has full access for admin operations
CREATE POLICY "Service role full access to admin_users"
ON public.admin_users
USING (auth.jwt()->>'role' = 'service_role');

-- ================================================
-- MEMBERS POLICIES  
-- ================================================

-- Members can read their own data
CREATE POLICY "Members can read own data"
ON public.members FOR SELECT
USING (auth.uid()::text = id);

-- Members can update their own data
CREATE POLICY "Members can update own data"
ON public.members FOR UPDATE
USING (auth.uid()::text = id);

-- Service role can manage members
CREATE POLICY "Service role full access to members"
ON public.members
USING (auth.jwt()->>'role' = 'service_role');

-- ================================================
-- PROPERTIES POLICIES
-- ================================================

-- Anyone can read properties (public listings)
CREATE POLICY "Public read access to properties"
ON public.properties FOR SELECT
TO public
USING (true);

-- Only service role can insert properties
CREATE POLICY "Service role can insert properties"
ON public.properties FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Only service role can update properties
CREATE POLICY "Service role can update properties"
ON public.properties FOR UPDATE  
USING (auth.jwt()->>'role' = 'service_role');

-- Only service role can delete properties
CREATE POLICY "Service role can delete properties"
ON public.properties FOR DELETE
USING (auth.jwt()->>'role' = 'service_role');

-- ================================================
-- INQUIRIES POLICIES
-- ================================================

-- Anyone can insert inquiries (contact forms)
CREATE POLICY "Public can insert inquiries"
ON public.inquiries FOR INSERT
TO public
WITH CHECK (true);

-- Service role can read all inquiries
CREATE POLICY "Service role can read inquiries"
ON public.inquiries FOR SELECT
USING (auth.jwt()->>'role' = 'service_role');

-- Service role can update inquiry status
CREATE POLICY "Service role can update inquiries"
ON public.inquiries FOR UPDATE
USING (auth.jwt()->>'role' = 'service_role');

-- Service role can delete inquiries
CREATE POLICY "Service role can delete inquiries"
ON public.inquiries FOR DELETE
USING (auth.jwt()->>'role' = 'service_role');

-- ================================================
-- SITE CONTENT POLICIES
-- ================================================

-- Anyone can read site content
CREATE POLICY "Public read access to site_content"
ON public.site_content FOR SELECT
TO public
USING (true);

-- Only service role can modify site content
CREATE POLICY "Service role can modify site_content"
ON public.site_content FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can update site_content"
ON public.site_content FOR UPDATE
USING (auth.jwt()->>'role' = 'service_role');

-- ================================================
-- TEAM MEMBERS POLICIES
-- ================================================

-- Anyone can read team members (public info)
CREATE POLICY "Public read access to team_members"
ON public.team_members FOR SELECT
TO public
USING (true);

-- Only service role can manage team members
CREATE POLICY "Service role can manage team_members"
ON public.team_members
USING (auth.jwt()->>'role' = 'service_role');

-- ================================================
-- SECURITY NOTES
-- ================================================
-- 1. Service role key should NEVER be exposed to client
-- 2. Use anon key for public operations
-- 3. Implement server-side API routes for admin operations
-- 4. Consider adding rate limiting at application level
-- 5. Monitor and log all database access
