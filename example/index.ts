import { inferVoiceFile } from "./rvc"

(async () => {
  await inferVoiceFile('Macron', 'audio-to-infer.wav', 0)
})()
