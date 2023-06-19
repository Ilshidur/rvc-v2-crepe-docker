import { client } from '@gradio/client';
import axios from 'axios';

type InferResult = {
  type: string;
  time: string;
  data: [
    string,
    {
      name: string;
      data: string;
      is_file: boolean;
    }
  ];
};

const RVC_CLIENT_URL = `http://${process.env.RVC_CLIENT_HOST}:${
  process.env.RVC_CLIENT_PORT || 7865
}/`;

export async function waitForReadiness() {
  while (!(await isUp())) {}
}

export async function isUp() {
  try {
    await axios.get(`${RVC_CLIENT_URL}`, {
      timeout: 1000,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function inferVoiceFile(
  model: string,
  voiceFileName: string,
  semiTones: number = 0
) {
  const app = await client(RVC_CLIENT_URL);

  await app.predict(1, [`${model}.pth`]);

  const result = (await app.predict(3, [
    0, // number (numeric value between 0 and 2333) in 'Select Singer/Speaker ID:' Slider component
    `/app/inputs/${voiceFileName}`, // string  in 'Enter the path of the audio file to be processed (the default is example of the correct format(Windows)):' Textbox component
    semiTones, // number  in 'transpose(Input must be integer, represents number of semitones. Example: octave sharp: 12;octave flat: -12):' Number component
    null, // blob in 'F0 curve file(optional),one pitch per line. Overrides the default F0 and ups and downs :' File component
    'crepe', // string  in 'Select the algorithm for pitch extraction.('pm': fast conversions; 'harvest': better pitch accuracy, but conversion might be extremely slow):' Radio component
    '', // string  in 'Path to Feature index file(If null, use dropdown result):' Textbox component
    `logs/${model}/Index.index`, // string (Option from: ['logs/Macron/Index.index', 'logs/Nounours/Index.index']) in 'Path to the '.index' file in 'logs' directory is auto detected. Pick the matching file from the dropdown:' Dropdown component
    0.76, // number (numeric value between 0 and 1) in 'Search feature ratio:' Slider component
    3, // number (numeric value between 0 and 7) in 'If >=3: using median filter for f0. The number is median filter radius.' Slider component
    0, // number (numeric value between 0 and 48000) in 'Resample the audio in post-processing to a different sample rate.(Default(0): No post-resampling):' Slider component
    0.2, // number (numeric value between 0 and 1) in 'Use volume envelope of input to mix or replace the volume envelope of output, the closer the rate is to 1, the more output envelope is used.(Default(1): don't mix input envelope):' Slider component
    64, // number (numeric value between 1 and 512) in 'Crepe Hop Length (Only applies to crepe): Hop length refers to the time it takes for the speaker to jump to a dramatic pitch. Lower hop lengths take more time to infer but are more pitch accurate.' Slider component
  ])) as InferResult;

  // We could download the file from the HTTP API but we'll use the Docker volume for optimisation purposes.

  const remoteOutputFile = result.data[1].name;

  const match = /^\/app\/TEMP\/gradio\/(?<file>.*)$/.exec(remoteOutputFile);

  if (!match?.groups) {
    return {
      filename: undefined,
      fromAssetsPath: undefined,
      path: undefined,
    };
  }

  return {
    filename: match.groups.file,
  };
}
