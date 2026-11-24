// Web Audio API yordamida tashqi MP3 fayllarsiz ishlaydigan sintezator va fokus shovqinlari

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientNode = null;
    this.ambientGain = null;
    this.activeAmbientType = null;
    this.alarmInterval = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration = 0.35, type = 'sine', delay = 0, volume = 0.25) {
    try {
      this.initContext();
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {
      console.warn('Audio play blocked:', e);
    }
  }

  playMelody(style = 'marimba') {
    if (style === 'marimba') {
      this.playTone(523.25, 0.28, 'sine', 0, 0.28);     // C5
      this.playTone(659.25, 0.28, 'sine', 0.14, 0.28);  // E5
      this.playTone(783.99, 0.35, 'sine', 0.28, 0.3);   // G5
      this.playTone(1046.5, 0.5, 'sine', 0.42, 0.32);   // C6
    } else if (style === 'zen') {
      this.playTone(432, 1.4, 'sine', 0, 0.3);
      this.playTone(648, 1.2, 'triangle', 0.2, 0.15);
    } else if (style === 'digital') {
      this.playTone(880, 0.15, 'square', 0, 0.14);
      this.playTone(880, 0.15, 'square', 0.2, 0.14);
      this.playTone(1174.66, 0.3, 'square', 0.4, 0.16);
    } else {
      // classic
      this.playTone(740, 0.22, 'triangle', 0, 0.25);
      this.playTone(587.33, 0.22, 'triangle', 0.24, 0.25);
      this.playTone(740, 0.22, 'triangle', 0.48, 0.25);
    }
  }

  startAlarmLoop(style = 'marimba') {
    this.stopAlarmLoop();
    this.playMelody(style);
    this.alarmInterval = setInterval(() => {
      this.playMelody(style);
    }, 2200);
  }

  stopAlarmLoop() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  playPomodoroComplete() {
    this.playTone(587.33, 0.35, 'sine', 0, 0.25);
    this.playTone(783.99, 0.35, 'sine', 0.18, 0.25);
    this.playTone(987.77, 0.65, 'sine', 0.36, 0.28);
  }

  toggleAmbient(type) {
    if (this.activeAmbientType === type) {
      this.stopAmbient();
      return null;
    }

    this.stopAmbient();
    this.initContext();

    if (type === 'brown') {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);

      whiteNoise.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start(0);

      this.ambientNode = whiteNoise;
      this.ambientGain = gain;
      this.activeAmbientType = 'brown';
      return 'brown';
    }

    if (type === 'alpha') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();

      this.ambientNode = osc;
      this.ambientGain = gain;
      this.activeAmbientType = 'alpha';
      return 'alpha';
    }

    return null;
  }

  stopAmbient() {
    if (this.ambientNode) {
      try {
        this.ambientNode.stop();
        this.ambientNode.disconnect();
      } catch (_) {}
      this.ambientNode = null;
    }
    this.activeAmbientType = null;
  }
}

export const soundEngine = new SoundEngine();
