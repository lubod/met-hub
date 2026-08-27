import { action, makeObservable, observable } from "mobx";

export interface MqttSettings {
  enabled: boolean;
  haDiscovery: boolean;
  topicBase: string;
}

export interface RetentionSettings {
  enabled: boolean;
  days: number;
  hour: number;
}

export interface BridgeSettings {
  autoClaim: boolean;
  autoClaimMaxPerDay: number;
  forwardUpstream: boolean;
  upstreamWuUrl: string;
  upstreamEcowittUrl: string;
}

export interface RuntimeInfo {
  mqttClients: number;
  retentionLastRun: string | null;
}

export interface MqttCredentials {
  username: string;
  password: string;
  brokerUrl: string;
  discoveryPrefix: string;
}

class SettingsData {
  loading = false;

  loaded = false;

  saving: string | null = null;

  error = "";

  mqtt: MqttSettings = { enabled: false, haDiscovery: true, topicBase: "methub" };

  retention: RetentionSettings = { enabled: false, days: 730, hour: 3 };

  bridge: BridgeSettings = {
    autoClaim: false,
    autoClaimMaxPerDay: 5,
    forwardUpstream: false,
    upstreamWuUrl: "",
    upstreamEcowittUrl: "",
  };

  runtime: RuntimeInfo = { mqttClients: 0, retentionLastRun: null };

  report: string = "";

  creds: MqttCredentials | null = null;

  constructor() {
    makeObservable(this, {
      loading: observable,
      loaded: observable,
      saving: observable,
      error: observable,
      mqtt: observable,
      retention: observable,
      bridge: observable,
      runtime: observable,
      report: observable,
      creds: observable,
      load: action,
      setMqtt: action,
      setRetention: action,
      setBridge: action,
      setCreds: action,
      clearCreds: action,
      setError: action,
      setSaving: action,
    });
  }

  load(): void {
    this.loading = true;
    this.error = "";
    fetch("/api/settings", {
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.status === 403) {
          // Non-admin: admin sections render as read-only placeholders.
          this.loaded = true;
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        this.setMqtt(json.settings.mqtt);
        this.setRetention(json.settings.retention);
        this.setBridge(json.settings.bridge);
        this.runtime = json.runtime;
        this.loaded = true;
      })
      .catch((err) => {
        this.error = err instanceof Error ? err.message : String(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  setMqtt(value: MqttSettings): void {
    this.mqtt = value;
  }

  setRetention(value: RetentionSettings): void {
    this.retention = value;
  }

  setBridge(value: BridgeSettings): void {
    this.bridge = value;
  }

  setCreds(value: MqttCredentials | null): void {
    this.creds = value;
  }

  clearCreds(): void {
    this.creds = null;
  }

  setError(message: string): void {
    this.error = message;
  }

  setSaving(section: string | null): void {
    this.saving = section;
  }
}

export default SettingsData;
