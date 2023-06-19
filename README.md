# RVC v2 + crepe

## How to run

### Using Docker

```bash
docker run \
    --name="rvc-v2-crepe" \
    -v ./logs:/app/logs \
    -v ./weights:/app/weights \
    -v ./inputs:/app/inputs \
    -v ./outputs:/app/audio-outputs \
    -v ./temp-outputs:/app/TEMP/gradio \
    -p "7865:7865" \
    --gpus="all" \
    ilshidur/rvc-2.0-crepe
```

### Using Docker compose

```yml
# docker-compose.yml
version: '3.3'

services:
  rvc-2-0-crepe:
    image: ilshidur/rvc-2.0-crepe
    container_name: rvc-2-0-crepe
    volumes:
      - ./logs:/app/logs
      - ./weights:/app/weights
      - ./inputs:/app/inputs
      - ./outputs:/app/audio-outputs
      - ./temp-outputs:/app/TEMP/gradio
    ports:
      - "7865:7865"
    deploy: # --gpus all
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

```

Then run :

```bash
docker compose up --build
```

## UI

-> http://localhost:7865

As this is a Gradio app, you can interact with it using the WebSocket API to automate voice cloning.

## Querying using the Gradio API

Check out the `example` folder to have an insight of a Node.js client infering an audio file using a pre-existing model.
Please note that this example is just a code sample, not a fully working project.
