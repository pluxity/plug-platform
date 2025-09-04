export const buildWhepUrl = (host: string, port: string | number, path: string) => {
  return `http://${host}:${port}/${encodeURIComponent(path)}/whep`;
};

export interface WhepNegotiationResult {
  answerSdp: string;
}

export async function performWhepNegotiation(
  pc: RTCPeerConnection,
  url: string,
  signal?: AbortSignal
): Promise<WhepNegotiationResult> {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/sdp' },
    body: offer.sdp || '',
    signal,
  });
  if (!response.ok) throw new Error(`WHEP ${response.status}`);
  const answerSdp = await response.text();
  await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
  return { answerSdp };
}

export function prepareReceiverPeerConnection(onVideoStream: (stream: MediaStream) => void) {
  const pc = new RTCPeerConnection();
  pc.addEventListener('track', (evt) => {
    if (evt.track.kind === 'video' && evt.streams[0]) {
      onVideoStream(evt.streams[0]);
    }
  });
  pc.addTransceiver('video', { direction: 'recvonly' });
  pc.addTransceiver('audio', { direction: 'recvonly' });
  return pc;
}