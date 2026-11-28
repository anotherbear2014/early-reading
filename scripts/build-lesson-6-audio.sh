#!/bin/zsh

set -euo pipefail

repo_dir=${0:A:h:h}
source_dir="$repo_dir/audio-source/elevenlabs/bella"
lesson_dir="$repo_dir/public/audio/lesson-6"
sound_dir="$repo_dir/public/audio/sounds"
work_dir=$(mktemp -d "${TMPDIR:-/tmp}/early-reading-lesson6.XXXXXX")

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

# The Hamburg /p/ is already the production master and must remain byte-for-byte intact.
cp "$repo_dir/audio-source/hamburg/p-sound.wav" "$sound_dir/p.wav"

# Keep about 50 ms before and 120 ms after the natural sustained /f/, then apply
# the established Dad phoneme loudness/format workflow.
ffmpeg -hide_banner -loglevel error -y -i "$repo_dir/audio-source/dad/f-sound.m4a" \
  -af 'aformat=sample_rates=44100:channel_layouts=mono,atrim=start=0.29:end=1.56,asetpts=PTS-STARTPTS,loudnorm=I=-19:TP=-1.5:LRA=7' \
  -ar 44100 -ac 1 -c:a pcm_s16le "$sound_dir/f.wav"

# Lesson 5 already contains the generic production masters used by this lesson.
cp "$repo_dir/public/audio/lesson-5/welcome.wav" "$lesson_dir/welcome.wav"
cp "$repo_dir/public/audio/lesson-5/tap-the-sounds.wav" "$lesson_dir/tap-the-sounds.wav"
cp "$repo_dir/public/audio/lesson-5/what-sound.wav" "$lesson_dir/what-sound.wav"
cp "$repo_dir/public/audio/lesson-5/great-reading.wav" "$lesson_dir/great-reading.wav"

normalize_bella "$source_dir/this-sound-is.mp3" "$work_dir/this-sound-is.wav"
normalize_bella "$source_dir/your-turn-say-sound.mp3" "$work_dir/your-turn-say-sound.wav"
normalize_bella "$source_dir/tap-the.mp3" "$work_dir/tap-the.wav"
normalize_bella "$source_dir/tap-picture-begins-with.mp3" "$work_dir/tap-picture-begins-with.wav"
normalize_bella "$source_dir/good-job.mp3" "$work_dir/good-job.wav"

make_silence 0.07 "$work_dir/gap-70.wav"
make_silence 0.12 "$work_dir/gap-120.wav"
make_silence 0.22 "$work_dir/gap-220.wav"

ffmpeg -hide_banner -loglevel error -y \
  -i "$work_dir/this-sound-is.wav" -i "$work_dir/gap-70.wav" -i "$sound_dir/p.wav" \
  -i "$work_dir/gap-120.wav" -i "$work_dir/your-turn-say-sound.wav" \
  -i "$work_dir/gap-70.wav" -i "$sound_dir/p.wav" \
  -filter_complex '[0:a][1:a][2:a][3:a][4:a][5:a][6:a]concat=n=7:v=0:a=1[out]' \
  -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$lesson_dir/p-intro.wav"

ffmpeg -hide_banner -loglevel error -y \
  -i "$work_dir/this-sound-is.wav" -i "$work_dir/gap-70.wav" -i "$sound_dir/f.wav" \
  -i "$work_dir/gap-120.wav" -i "$work_dir/your-turn-say-sound.wav" \
  -i "$work_dir/gap-70.wav" -i "$sound_dir/f.wav" \
  -filter_complex '[0:a][1:a][2:a][3:a][4:a][5:a][6:a]concat=n=7:v=0:a=1[out]' \
  -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$lesson_dir/f-intro.wav"

for name in pig penguin pencil; do
  normalize_bella "$source_dir/$name-starts-with.mp3" "$work_dir/$name-starts-with.wav"
  concat_three "$work_dir/$name-starts-with.wav" "$work_dir/gap-70.wav" \
    "$sound_dir/p.wav" "$lesson_dir/$name-p.wav"
done

for name in fish flower; do
  normalize_bella "$source_dir/$name-starts-with.mp3" "$work_dir/$name-starts-with.wav"
  concat_three "$work_dir/$name-starts-with.wav" "$work_dir/gap-70.wav" \
    "$sound_dir/f.wav" "$lesson_dir/$name-f.wav"
done

normalize_bella "$source_dir/trace-p.mp3" "$lesson_dir/trace-p.wav"
normalize_bella "$source_dir/trace-f.mp3" "$lesson_dir/trace-f.wav"

# The prepared phonemes already contain about 50 ms of leading silence, so no
# additional gap is needed for the approximately 30 ms short prompts.
ffmpeg -hide_banner -loglevel error -y \
  -i "$work_dir/tap-the.wav" -i "$sound_dir/p.wav" \
  -filter_complex '[0:a][1:a]concat=n=2:v=0:a=1[out]' \
  -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$lesson_dir/tap-p.wav"
ffmpeg -hide_banner -loglevel error -y \
  -i "$work_dir/tap-the.wav" -i "$sound_dir/f.wav" \
  -filter_complex '[0:a][1:a]concat=n=2:v=0:a=1[out]' \
  -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$lesson_dir/tap-f.wav"
ffmpeg -hide_banner -loglevel error -y \
  -i "$work_dir/tap-picture-begins-with.wav" -i "$sound_dir/p.wav" \
  -filter_complex '[0:a][1:a]concat=n=2:v=0:a=1[out]' \
  -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$lesson_dir/tap-picture-p.wav"
ffmpeg -hide_banner -loglevel error -y \
  -i "$work_dir/tap-picture-begins-with.wav" -i "$sound_dir/f.wav" \
  -filter_complex '[0:a][1:a]concat=n=2:v=0:a=1[out]' \
  -map '[out]' -ar 44100 -ac 1 -c:a pcm_s16le "$lesson_dir/tap-picture-f.wav"

for name in pig fish; do
  normalize_bella "$source_dir/yes-thats-the-$name.mp3" "$work_dir/yes-thats-the-$name.wav"
  concat_three "$work_dir/yes-thats-the-$name.wav" "$work_dir/gap-220.wav" \
    "$work_dir/good-job.wav" "$lesson_dir/yes-thats-the-$name-good-job.wav"
done

normalize_bella "$source_dir/sun.mp3" "$lesson_dir/sun.wav"
normalize_bella "$source_dir/nest.mp3" "$lesson_dir/nest.wav"
