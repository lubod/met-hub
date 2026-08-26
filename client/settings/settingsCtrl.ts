import SettingsData from "./settingsData";

export default class SettingsCtrl {
  data: SettingsData;

  constructor() {
    this.data = new SettingsData();
  }

  async load(): Promise<void> {
    await this.data.load();
  }

  async save(section: "mqtt" | "retention" | "bridge"): Promise<boolean> {
    this.data.setSaving(section);
    this.data.setError("");
    try {
      const body =
        section === "mqtt"
          ? { ...this.data.mqtt }
          : section === "retention"
          ? { ...this.data.retention }
          : { ...this.data.bridge };
      const res = await fetch(`/api/settings/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.msg || `HTTP ${res.status}`);
      }
      const json = await res.json();
      if (section === "mqtt") this.data.setMqtt(json.settings.mqtt);
      if (section === "retention") this.data.setRetention(json.settings.retention);
      if (section === "bridge") this.data.setBridge(json.settings.bridge);
      return true;
    } catch (err) {
      this.data.setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      this.data.setSaving(null);
    }
  }

  async runRetention(): Promise<void> {
    this.data.setSaving("retention-run");
    this.data.setError("");
    try {
      const res = await fetch("/api/settings/retention/run", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const report = await res.json();
      this.data.report = `${report.totalDeleted} rows removed in ${
        Math.round(report.durationMs / 100) / 10
      } s${report.partial ? " (partial — duration cap)" : ""}`;
      await this.load();
    } catch (err) {
      this.data.setError(err instanceof Error ? err.message : String(err));
    } finally {
      this.data.setSaving(null);
    }
  }

  async generateCredentials(): Promise<void> {
    this.data.setSaving("creds");
    this.data.setError("");
    try {
      const res = await fetch("/api/mqtt/credentials", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.data.setCreds(await res.json());
    } catch (err) {
      this.data.setError(err instanceof Error ? err.message : String(err));
    } finally {
      this.data.setSaving(null);
    }
  }

  async revokeCredentials(): Promise<void> {
    this.data.setSaving("creds");
    this.data.setError("");
    try {
      await fetch("/api/mqtt/credentials", { method: "DELETE" });
      this.data.clearCreds();
    } catch (err) {
      this.data.setError(err instanceof Error ? err.message : String(err));
    } finally {
      this.data.setSaving(null);
    }
  }
}
