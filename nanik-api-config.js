window.NANIK_API = {
  supabaseUrl: 'https://zljowsxavbpqfdskekwd.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsam93c3hhdmJwcWZkc2tla3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjM2NjgsImV4cCI6MjA5MjE5OTY2OH0.sGswPfq4uBKgYsp2b5JNU-mETXqLCGpooVbLmUlgXi4',
  higgsProxy: 'https://zljowsxavbpqfdskekwd.supabase.co' + '/functions/v1/higgs-proxy',
  claudeProxy: 'https://zljowsxavbpqfdskekwd.supabase.co' + '/functions/v1/claude-proxy',
  plannerProxy: 'https://zljowsxavbpqfdskekwd.supabase.co' + '/functions/v1/web-planner-proxy',
  previewText: 'Everyone thought the little dragon was fast asleep in his bed... but look up there! He\'s flying right over the moon! Can you see him waving?',
  maxRecordMs: 10000,
  minRecordMs: 5000,
  // Must match Nanik app: src/constants/higgsNarration.ts + supabase/functions/_shared/higgs.ts
  // temperature 0.75 · topP 0.95 · topK 50 · maxNewTokens 2047 · pcm · ~60-word packs
  higgs: {
    sampleRate: 24000,
    cloneTargetSec: 9,
    cloneTailSilenceMs: 500,
    modelId: 'higgs-tts-3',
    responseFormat: 'pcm',
    temperature: 0.75,
    maxNewTokens: 2047,
    topK: 50,
    topP: 0.95,
    speakingRate: 1.0,
    interChunkMs: 1200,
    interChunkRateLimitMs: 5000,
    chunkMaxWords: 60,
    chunkCoalesceMinWords: 40,
    chunkMaxChars: 1800,
    chunkMaxTokens: 2047,
    chunkSentencesMax: 16
  }
};
