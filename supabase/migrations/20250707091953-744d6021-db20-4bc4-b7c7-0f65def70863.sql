-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  budget TEXT,
  start_date DATE,
  end_date DATE,
  team_size INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can view all projects" 
  ON public.projects 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create projects" 
  ON public.projects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.projects 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.projects 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create project_resources junction table for many-to-many relationship
CREATE TABLE public.project_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, resource_id)
);

-- Enable Row Level Security for project_resources
ALTER TABLE public.project_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for project_resources
CREATE POLICY "Users can view all project resources" 
  ON public.project_resources 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can assign resources to projects" 
  ON public.project_resources 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove resources from their projects" 
  ON public.project_resources 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );