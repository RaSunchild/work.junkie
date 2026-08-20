CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TYPE public.commission_kind AS ENUM ('package', 'custom');
CREATE TYPE public.commission_status AS ENUM ('new', 'reviewing', 'quoted', 'accepted', 'declined', 'archived');

CREATE TABLE public.commission_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  kind commission_kind NOT NULL,
  package_slug text,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  project_type text,
  budget_range text,
  timeline text,
  message text NOT NULL,
  references_url text,
  status commission_status NOT NULL DEFAULT 'new'
);

GRANT INSERT ON public.commission_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.commission_requests TO authenticated;
GRANT ALL ON public.commission_requests TO service_role;

ALTER TABLE public.commission_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a commission request"
  ON public.commission_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND length(name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(message) BETWEEN 10 AND 2000
    AND (phone IS NULL OR length(phone) <= 50)
    AND (project_type IS NULL OR length(project_type) <= 100)
    AND (budget_range IS NULL OR length(budget_range) <= 50)
    AND (timeline IS NULL OR length(timeline) <= 200)
    AND (references_url IS NULL OR length(references_url) <= 500)
    AND (package_slug IS NULL OR length(package_slug) <= 100)
  );

CREATE POLICY "Admins can view all commission requests"
  ON public.commission_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update commission requests"
  ON public.commission_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete commission requests"
  ON public.commission_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_commission_requests_created_at ON public.commission_requests (created_at DESC);
CREATE INDEX idx_commission_requests_status ON public.commission_requests (status);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;