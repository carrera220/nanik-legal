window.NANIK_API = {
  supabaseUrl: 'https://zljowsxavbpqfdskekwd.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsam93c3hhdmJwcWZkc2tla3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjM2NjgsImV4cCI6MjA5MjE5OTY2OH0.sGswPfq4uBKgYsp2b5JNU-mETXqLCGpooVbLmUlgXi4',
  higgsProxy: 'https://zljowsxavbpqfdskekwd.supabase.co' + '/functions/v1/higgs-proxy',
  previewText: 'Once upon a time, a magical helper named Nanik turned toy photos into beautiful, illustrated bedtime stories, reading them aloud in your very own voice so little ones could sleep happily ever after.',
  maxRecordMs: 10000,
  minRecordMs: 5000,
  // Must match Nanik app: src/constants/higgsNarration.ts + supabase/functions/_shared/higgs.ts
  // temperature 0.9 · topP 0.95 · topK 0 (omit) · maxNewTokens 2047 · pcm · ~60-word packs
  higgs: {
    sampleRate: 24000,
    cloneTargetSec: 9,
    cloneTailSilenceMs: 500,
    modelId: 'higgs-tts-3',
    responseFormat: 'pcm',
    temperature: 0.9,
    maxNewTokens: 2047,
    topK: 0,
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
