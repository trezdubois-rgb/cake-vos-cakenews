-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Enable pg_net for making HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create a cron job to publish scheduled articles every 5 minutes
SELECT cron.schedule(
  'publish-scheduled-articles',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
        url:=concat(current_setting('app.settings.supabase_url'), '/functions/v1/publish-scheduled-articles'),
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', concat('Bearer ', current_setting('app.settings.supabase_service_role_key'))
        ),
        body:=jsonb_build_object('time', now())
    ) as request_id;
  $$
);