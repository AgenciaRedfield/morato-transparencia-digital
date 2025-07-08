-- Create table for agenda events
CREATE TABLE public.agenda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_evento DATE NOT NULL,
  hora_inicio TIME,
  hora_fim TIME,
  local TEXT,
  tipo_evento TEXT NOT NULL DEFAULT 'sessao',
  status TEXT NOT NULL DEFAULT 'agendado',
  publico BOOLEAN NOT NULL DEFAULT true,
  autor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view public agenda events" 
ON public.agenda 
FOR SELECT 
USING (publico = true);

CREATE POLICY "Authenticated users can manage agenda events" 
ON public.agenda 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_agenda_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agenda_updated_at
BEFORE UPDATE ON public.agenda
FOR EACH ROW
EXECUTE FUNCTION public.update_agenda_updated_at();