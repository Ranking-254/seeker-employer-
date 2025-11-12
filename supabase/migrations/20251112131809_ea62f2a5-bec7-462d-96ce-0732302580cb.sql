-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('job_seeker', 'employer', 'admin');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');

-- Create enum for job type
CREATE TYPE public.job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create job seeker profiles table
CREATE TABLE public.job_seeker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  bio TEXT,
  skills TEXT[],
  education JSONB,
  experience JSONB,
  cv_url TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create employer profiles table
CREATE TABLE public.employer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  company_description TEXT,
  company_logo TEXT,
  company_website TEXT,
  industry TEXT,
  company_size TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  job_type job_type NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  job_seeker_id UUID NOT NULL REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  cover_letter TEXT,
  cv_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, job_seeker_id)
);

-- Create saved jobs table
CREATE TABLE public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_id UUID NOT NULL REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_seeker_id, job_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Job seeker profiles policies
CREATE POLICY "Anyone can view job seeker profiles"
  ON public.job_seeker_profiles FOR SELECT
  USING (true);

CREATE POLICY "Job seekers can update own profile"
  ON public.job_seeker_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Job seekers can insert own profile"
  ON public.job_seeker_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Employer profiles policies
CREATE POLICY "Anyone can view employer profiles"
  ON public.employer_profiles FOR SELECT
  USING (true);

CREATE POLICY "Employers can update own profile"
  ON public.employer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Employers can insert own profile"
  ON public.employer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (is_active = true OR auth.uid() IN (
    SELECT user_id FROM public.employer_profiles WHERE id = employer_id
  ));

CREATE POLICY "Employers can insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.employer_profiles WHERE id = employer_id
  ));

CREATE POLICY "Employers can update own jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.employer_profiles WHERE id = employer_id
  ));

CREATE POLICY "Employers can delete own jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() IN (
    SELECT user_id FROM public.employer_profiles WHERE id = employer_id
  ));

-- Applications policies
CREATE POLICY "Job seekers can view own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.job_seeker_profiles WHERE id = job_seeker_id
  ));

CREATE POLICY "Employers can view applications for their jobs"
  ON public.applications FOR SELECT
  USING (auth.uid() IN (
    SELECT ep.user_id FROM public.employer_profiles ep
    JOIN public.jobs j ON j.employer_id = ep.id
    WHERE j.id = job_id
  ));

CREATE POLICY "Job seekers can insert applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.job_seeker_profiles WHERE id = job_seeker_id
  ));

CREATE POLICY "Employers can update application status"
  ON public.applications FOR UPDATE
  USING (auth.uid() IN (
    SELECT ep.user_id FROM public.employer_profiles ep
    JOIN public.jobs j ON j.employer_id = ep.id
    WHERE j.id = job_id
  ));

-- Saved jobs policies
CREATE POLICY "Job seekers can view own saved jobs"
  ON public.saved_jobs FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.job_seeker_profiles WHERE id = job_seeker_id
  ));

CREATE POLICY "Job seekers can insert saved jobs"
  ON public.saved_jobs FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.job_seeker_profiles WHERE id = job_seeker_id
  ));

CREATE POLICY "Job seekers can delete saved jobs"
  ON public.saved_jobs FOR DELETE
  USING (auth.uid() IN (
    SELECT user_id FROM public.job_seeker_profiles WHERE id = job_seeker_id
  ));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'job_seeker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_job_seeker_profiles_updated_at
  BEFORE UPDATE ON public.job_seeker_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_employer_profiles_updated_at
  BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for better query performance
CREATE INDEX idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_job_seeker_id ON public.applications(job_seeker_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_saved_jobs_job_seeker_id ON public.saved_jobs(job_seeker_id);
CREATE INDEX idx_saved_jobs_job_id ON public.saved_jobs(job_id);