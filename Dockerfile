# This while Docker image is based on ilshidur/rvc-2.0-crepe-base, which is just
# roughly full build of the Dockerfile located in https://github.com/Mangio621/Mangio-RVC-Fork.
# See : https://hub.docker.com/r/ilshidur/rvc-2.0-crepe-base
FROM ilshidur/rvc-2.0-crepe-base

# Allow the use to add weights and indexes.
VOLUME /app/logs
VOLUME /app/weights

# Add Nvidia GPUs support.
RUN distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
   && curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add - \
   && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | tee /etc/apt/sources.list.d/nvidia-docker.list

# Also add missing ffmpeg executable.
RUN apt-get update && apt-get install -y nvidia-docker2 ffmpeg
