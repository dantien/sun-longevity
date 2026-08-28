/**
 * Standard Bluetooth Low Energy (BLE) Heart Rate GATT Driver
 * Supports Polar (H10/H9), Garmin (HRM-Pro), Wahoo (TICKR), CooSpo, Suunto etc.
 * Service UUID: 0x180D (Heart Rate)
 * Characteristic UUID: 0x2A37 (Heart Rate Measurement)
 */

export interface HeartRateData {
  bpm: number;
  rrIntervalMs?: number;
  contactDetected?: boolean;
  energyExpendedJoules?: number;
  timestamp: number;
}

export type BleConnectionStatus = 
  | "DISCONNECTED"
  | "SCANNING"
  | "CONNECTING"
  | "CONNECTED"
  | "RECONNECTING"
  | "ERROR";

export class BluetoothHeartRateManager {
  private static instance: BluetoothHeartRateManager;
  private status: BleConnectionStatus = "DISCONNECTED";
  private currentBpm: number = 0;
  private listeners: Array<(data: HeartRateData) => void> = [];
  private statusListeners: Array<(status: BleConnectionStatus, deviceName?: string) => void> = [];
  private connectedDeviceName: string = "";
  private mockInterval: any = null;

  public static getInstance(): BluetoothHeartRateManager {
    if (!BluetoothHeartRateManager.instance) {
      BluetoothHeartRateManager.instance = new BluetoothHeartRateManager();
    }
    return BluetoothHeartRateManager.instance;
  }

  public addHeartRateListener(listener: (data: HeartRateData) => void) {
    this.listeners.push(listener);
  }

  public removeHeartRateListener(listener: (data: HeartRateData) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  public addStatusListener(listener: (status: BleConnectionStatus, deviceName?: string) => void) {
    this.statusListeners.push(listener);
  }

  private notifyStatus(status: BleConnectionStatus, deviceName?: string) {
    this.status = status;
    this.statusListeners.forEach(l => l(status, deviceName || this.connectedDeviceName));
  }

  private notifyData(data: HeartRateData) {
    this.currentBpm = data.bpm;
    this.listeners.forEach(l => l(data));
  }

  /**
   * Parses standard 0x2A37 Heart Rate Measurement byte buffer
   */
  public parseHeartRateMeasurement(dataView: DataView): HeartRateData {
    const flags = dataView.getUint8(0);
    const is16Bit = (flags & 0x01) !== 0;
    const contactDetected = (flags & 0x06) === 0x06;
    const hasEnergyExpended = (flags & 0x08) !== 0;
    const hasRrIntervals = (flags & 0x10) !== 0;

    let offset = 1;
    let bpm: number;

    if (is16Bit) {
      bpm = dataView.getUint16(offset, true);
      offset += 2;
    } else {
      bpm = dataView.getUint8(offset);
      offset += 1;
    }

    let energy: number | undefined;
    if (hasEnergyExpended) {
      energy = dataView.getUint16(offset, true);
      offset += 2;
    }

    let rrIntervalMs: number | undefined;
    if (hasRrIntervals && offset < dataView.byteLength) {
      // RR interval resolution is 1/1024 seconds
      const rawRr = dataView.getUint16(offset, true);
      rrIntervalMs = Math.round((rawRr / 1024) * 1000);
    }

    return {
      bpm,
      rrIntervalMs,
      contactDetected,
      energyExpendedJoules: energy,
      timestamp: Date.now(),
    };
  }

  /**
   * DEV SIMULATOR: Simulates realistic heart rate rising into and above MAF zone
   * for testing UI, speech coaching, and Audio Ducking in office/dev mode.
   */
  public startMockSimulator(targetMafMax: number = 131) {
    this.stopMockSimulator();
    this.notifyStatus("CONNECTED", "Dev Simulator (Polar H10 Mock)");
    let mockBpm = targetMafMax - 25; // Start warm-up around 106
    let step = 1;

    this.mockInterval = setInterval(() => {
      // Simulate realistic fluctuation
      if (mockBpm >= targetMafMax + 6) {
        step = -1; // simulate slowing down
      } else if (mockBpm <= targetMafMax - 15) {
        step = 1;
      }
      mockBpm += step;

      const randomJitter = Math.floor(Math.random() * 3) - 1;
      const finalBpm = mockBpm + randomJitter;
      const rr = Math.round(60000 / finalBpm);

      this.notifyData({
        bpm: finalBpm,
        rrIntervalMs: rr,
        contactDetected: true,
        timestamp: Date.now()
      });
    }, 1000);
  }

  public stopMockSimulator() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
      this.notifyStatus("DISCONNECTED");
    }
  }
}
