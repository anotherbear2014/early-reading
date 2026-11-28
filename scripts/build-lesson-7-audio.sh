#!/bin/zsh

set -euo pipefail

repo_dir=${0:A:h:h}
source_dir="$repo_dir/audio-source/elevenlabs/bella"
lesson_dir="$repo_dir/public/audio/lesson-7"
sound_dir="$repo_dir/public/audio/sounds"
work_dir=$(mktemp -d "${TMPDIR:-/tmp}/early-reading-lesson7.XXXXXX")

trap 'rm -rf "$work_dir"' EXIT

mkdir -p "$lesson_dir" "$sound_dir"

normalize_bella() {
  ffmpeg -hide_banner -loglevel error -y -i "$1" \
    -af 'aformat=sample_rates=44100:channel_layouts=mono,loudnorm=I=-19:TP=-1.5:LRA=7' \
    -ar 44100 -ac 1 -c:a pcm_s16le "$2"
}

make_silence() {
  ffmpeg -hide_banner -loglevel error -y \
    -f lavfi -i 'anullsrc=r=44100:cl=mono' -t "$1" -c:a pcm_s16le "$2"
}

concat_three() {
  ffmpeg -hide_banner -loglevel error -y \
    -i "$1" -i "$2" -i "$3" \
    -filter_complex '[0:a][1:a][2:a]concat=n=3:v=0:a=1[out]' \
    -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$4"
}

# Keep roughly 50 ms before and 120 ms after each natural Dad phoneme, discard
# later handling noise, then apply the same loudness/format workflow as Lesson 6.
ffmpeg -hide_banner -loglevel error -y -i "$repo_dir/audio-source/dad/o-sound.m4a" \
  -af 'aformat=sample_rates=44100:channel_layouts=mono,atrim=start=0.84:end=2.33,asetpts=PTS-STARTPTS,loudnorm=I=-19:TP=-1.5:LRA=7' \
  -ar 44100 -ac 1 -c:a pcm_s16le "$sound_dir/o.wav"
ffmpeg -hide_banner -loglevel error -y -i "$repo_dir/audio-source/dad/l-sound.m4a" \
  -af 'aformat=sample_rates=44100:channel_layouts=mono,atrim=start=0.41:end=2.26,asetpts=PTS-STARTPTS,loudnorm=I=-19:TP=-1.5:LRA=7' \
  -ar 44100 -ac 1 -c:a pcm_s16le "$sound_dir/l.wav"

# Reuse the established generic production masters without regenerating them.
cp "$repo_dir/public/audio/lesson-6/welcome.wav" "$lesson_dir/welcome.wav"
cp "$repo_dir/public/audio/lesson-6/tap-the-sounds.wav" "$lesson_dir/tap-the-sounds.wav"
cp "$repo_dir/public/audio/lesson-6/what-sound.wav" "$lesson_dir/what-sound.wav"
cp "$repo_dir/public/audio/lesson-6/great-reading.wav" "$lesson_dir/great-reading.wav"
normalize_bella "$source_dir/pig.mp3" "$lesson_dir/pig.wav"
normalize_bella "$source_dir/fish.mp3" "$lesson_dir/fish.wav"

normalize_bella "$source_dir/this-sound-is.mp3" "$work_dir/this-sound-is.wav"
normalize_bella "$source_dir/your-turn-say-sound.mp3" "$work_dir/your-turn-say-sound.wav"
normalize_bella "$source_dir/tap-the.mp3" "$work_dir/tap-the.wav"
normalize_bella "$source_dir/tap-picture-begins-with.mp3" "$work_dir/tap-picture-begins-with.wav"
normalize_bella "$source_dir/good-job.mp3" "$work_dir/good-job.wav"

make_silence 0.07 "$work_dir/gap-70.wav"
make_silence 0.12 "$work_dir/gap-120.wav"
make_silence 0.22 "$work_dir/gap-220.wav"

for sound in o l; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$work_dir/this-sound-is.wav" -i "$work_dir/gap-70.wav" -i "$sound_dir/$sound.wav" \
    -i "$work_dir/gap-120.wav" -i "$work_dir/your-turn-say-sound.wav" \
    -i "$work_dir/gap-70.wav" -i "$sound_dir/$sound.wav" \
    -filter_complex '[0:a][1:a][2:a][3:a][4:a][5:a][6:a]concat=n=7:v=0:a=1[out]' \
    -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$lesson_dir/$sound-intro.wav"
done

# The phonemes retain about 50 ms of natural leading room tone. A 70 ms added
# gap therefore makes the effective picture-association transition about 120 ms.
for name in ostrich octopus otter; do
  normalize_bella "$source_dir/$name-starts-with.mp3" "$work_dir/$name-starts-with.wav"
  concat_three "$work_dir/$name-starts-with.wav" "$work_dir/gap-70.wav" \
    "$sound_dir/o.wav" "$lesson_dir/$name-o.wav"
done

for name in leaf lion lemon lamp; do
  normalize_bella "$source_dir/$name-starts-with.mp3" "$work_dir/$name-starts-with.wav"
  concat_three "$work_dir/$name-starts-with.wav" "$work_dir/gap-70.wav" \
    "$sound_dir/l.wav" "$lesson_dir/$name-l.wav"
done

normalize_bella "$source_dir/trace-o.mp3" "$lesson_dir/trace-o.wav"
normalize_bella "$source_dir/trace-l.mp3" "$lesson_dir/trace-l.wav"

# No added gap is needed for the short prompts because each phoneme keeps its
# natural leading room tone.
for sound in o l; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$work_dir/tap-the.wav" -i "$sound_dir/$sound.wav" \
    -filter_complex '[0:a][1:a]concat=n=2:v=0:a=1[out]' \
    -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$lesson_dir/tap-$sound.wav"
  ffmpeg -hide_banner -loglevel error -y \
    -i "$work_dir/tap-picture-begins-with.wav" -i "$sound_dir/$sound.wav" \
    -filter_complex '[0:a][1:a]concat=n=2:v=0:a=1[out]' \
    -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$lesson_dir/tap-picture-$sound.wav"
done

for name in octopus lamp; do
  normalize_bella "$source_dir/yes-thats-the-$name.mp3" "$work_dir/yes-thats-the-$name.wav"
  concat_three "$work_dir/yes-thats-the-$name.wav" "$work_dir/gap-220.wav" \
    "$work_dir/good-job.wav" "$lesson_dir/yes-thats-the-$name-good-job.wav"
done
