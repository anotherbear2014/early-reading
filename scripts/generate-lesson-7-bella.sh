#!/bin/zsh

set -euo pipefail

if [[ -z "${ELEVENLABS_API_KEY:-}" ]]; then
  print -u2 'ELEVENLABS_API_KEY is not set.'
  exit 1
fi

repo_dir=${0:A:h:h}
output_dir="$repo_dir/audio-source/elevenlabs/bella"
voice_id='hpp4J3VqNfWAUOO0d1Us'
mkdir -p "$output_dir"

requests=(
  'ostrich-starts-with.mp3|Ostrich starts with'
  'octopus-starts-with.mp3|Octopus starts with'
  'otter-starts-with.mp3|Otter starts with'
  'leaf-starts-with.mp3|Leaf starts with'
  'lion-starts-with.mp3|Lion starts with'
  'lemon-starts-with.mp3|Lemon starts with'
  'lamp-starts-with.mp3|Lamp starts with'
  'trace-o.mp3|Now, trace the letter o.'
  'trace-l.mp3|Now, trace the letter l.'
  "yes-thats-the-octopus.mp3|Yes, that's the octopus!"
  "yes-thats-the-lamp.mp3|Yes, that's the lamp!"
  'pig.mp3|Pig.'
  'fish.mp3|Fish.'
)

for request in "${requests[@]}"; do
  filename=${request%%|*}
  phrase=${request#*|}
  data="{\"text\":\"$phrase\",\"model_id\":\"eleven_multilingual_v2\",\"voice_settings\":{\"stability\":0.5,\"similarity_boost\":0.8,\"style\":0,\"use_speaker_boost\":true,\"speed\":0.9}}"
  curl --fail --silent --show-error \
    --request POST "https://api.elevenlabs.io/v1/text-to-speech/$voice_id" \
    --header "xi-api-key: $ELEVENLABS_API_KEY" \
    --header 'Content-Type: application/json' \
    --header 'Accept: audio/mpeg' \
    --data "$data" \
    --output "$output_dir/$filename"
  print "Generated $filename"
done
