/* eslint-disable react/function-component-definition, jsx-a11y/label-has-associated-control, prefer-destructuring */
import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import { Container } from "../misc/container";
import Heading from "../misc/heading";
import Myhr from "../misc/myhr";
import Header from "../header/header";
import SettingsCtrl from "./settingsCtrl";

type Props = {
  appContext: AppContext;
  className?: string;
};

const settingsCtrl = new SettingsCtrl();

const Toggle = function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4 py-1.5 text-sm">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={`relative h-5 w-10 rounded-full transition-colors ${
          value ? "bg-cyan" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            value ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
};

const TextField = function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm">
      <span className="opacity-70">{label}</span>
      <input
        type={type}
        className="glass-input w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
};

const SectionTitle = ({ text }: { text: string }) => (
  <h2 className="text-base font-medium text-white/90">{text}</h2>
);

const AdminChip = () => (
  <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-400">
    admin only
  </span>
);

const SettingsView = observer(({ appContext, className }: Props) => {
  const data = settingsCtrl.data;
  const isAdmin = appContext.authCtrl.authData.isAdmin === true;
  const isAuth = appContext.authCtrl.authData.isAuth;

  React.useEffect(() => {
    if (isAuth) settingsCtrl.load();
  }, [isAuth]);

  if (!isAuth) {
    return (
      <Container className={className}>
        <Heading>Settings</Heading>
        <Myhr />
        <p className="text-white/70 text-sm">
          Sign in to manage MQTT credentials and station settings.
        </p>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <div className="flex items-center justify-between">
        <Heading>Settings</Heading>
        <button
          type="button"
          className="btn-glass px-3 py-1.5 text-sm"
          onClick={() => appContext.authCtrl.authData.setLocation("/")}
        >
          ← Back
        </button>
      </div>
      {data.error !== "" && (
        <div className="text-red text-sm">{data.error}</div>
      )}
      <Myhr />

      {/* MQTT credentials — self-service for every signed-in user */}
      <SectionTitle text="MQTT credentials" />
      <p className="text-white/60 text-sm">
        Connect Home Assistant (or any MQTT client) to your stations.
      </p>
      {data.creds == null ? (
        <button
          type="button"
          className="btn-glass mt-2 px-3 py-1.5 text-sm"
          disabled={data.saving === "creds"}
          onClick={() => settingsCtrl.generateCredentials()}
        >
          {data.saving === "creds" ? "Generating…" : "Generate credentials"}
        </button>
      ) : (
        <div className="mt-2 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
          <div>
            <span className="opacity-60">Broker: </span>
            <span className="font-mono">{data.creds.brokerUrl}</span>
          </div>
          <div>
            <span className="opacity-60">Username: </span>
            <span className="font-mono">{data.creds.username}</span>
          </div>
          <div>
            <span className="opacity-60">Password: </span>
            <span className="font-mono">{data.creds.password}</span>
            <span className="ml-2 opacity-50">(shown once — store it now)</span>
          </div>
          <div>
            <span className="opacity-60">Discovery prefix: </span>
            <span className="font-mono">{data.creds.discoveryPrefix}</span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              className="btn-glass px-3 py-1 text-xs"
              onClick={() => settingsCtrl.generateCredentials()}
            >
              Regenerate
            </button>
            <button
              type="button"
              className="btn-glass px-3 py-1 text-xs"
              onClick={() => settingsCtrl.revokeCredentials()}
            >
              Revoke
            </button>
          </div>
        </div>
      )}
      <Myhr />

      {/* Admin sections — visible to everyone, editable by admins only */}
      <>
        {!data.loaded && data.loading && (
          <div className="text-light/60">Loading…</div>
        )}
        {data.loaded && (
          <>
            {/* MQTT */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SectionTitle text="MQTT broker" />
                <AdminChip />
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="btn-glass px-3 py-1.5 text-sm"
                  disabled={data.saving === "mqtt"}
                  onClick={() => settingsCtrl.save("mqtt")}
                >
                  {data.saving === "mqtt" ? "Saving…" : "Save MQTT"}
                </button>
              )}
            </div>
            {isAdmin ? (
              <div className="flex flex-col gap-1">
                <Toggle
                  label="MQTT broker enabled"
                  value={data.mqtt.enabled}
                  onChange={(v) => data.setMqtt({ ...data.mqtt, enabled: v })}
                />
                <Toggle
                  label="Home Assistant auto-discovery"
                  value={data.mqtt.haDiscovery}
                  onChange={(v) =>
                    data.setMqtt({ ...data.mqtt, haDiscovery: v })
                  }
                />
                <TextField
                  label="Topic base"
                  value={data.mqtt.topicBase}
                  onChange={(v) => data.setMqtt({ ...data.mqtt, topicBase: v })}
                />
                <div className="text-xs opacity-50">
                  Connected clients: {data.runtime.mqttClients}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-light/50">
                This section is available to administrators only.
              </div>
            )}
            <Myhr />

            {/* Retention */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SectionTitle text="Data retention" />
                <AdminChip />
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="btn-glass px-3 py-1.5 text-sm"
                  disabled={data.saving === "retention"}
                  onClick={() => settingsCtrl.save("retention")}
                >
                  {data.saving === "retention" ? "Saving…" : "Save retention"}
                </button>
              )}
            </div>
            {isAdmin ? (
              <div className="flex flex-col gap-1">
                <Toggle
                  label="Data retention enabled (deletes old rows)"
                  value={data.retention.enabled}
                  onChange={(v) =>
                    data.setRetention({ ...data.retention, enabled: v })
                  }
                />
                {!data.retention.enabled && (
                  <div className="text-xs opacity-50">
                    Off — nothing is ever deleted.
                  </div>
                )}
                {data.retention.enabled && (
                  <>
                    <TextField
                      label="Keep history (days, min 400)"
                      type="number"
                      value={String(data.retention.days)}
                      onChange={(v) =>
                        data.setRetention({
                          ...data.retention,
                          days: Number(v),
                        })
                      }
                    />
                    <TextField
                      label="Run at hour (UTC, 0-23)"
                      type="number"
                      value={String(data.retention.hour)}
                      onChange={(v) =>
                        data.setRetention({
                          ...data.retention,
                          hour: Number(v),
                        })
                      }
                    />
                  </>
                )}
                <div className="text-xs opacity-50">
                  Last run: {data.runtime.retentionLastRun ?? "never"}
                  {data.report !== "" ? ` — ${data.report}` : ""}
                </div>
                <button
                  type="button"
                  className="btn-glass mt-1 w-fit px-3 py-1.5 text-sm"
                  disabled={data.saving === "retention-run"}
                  onClick={() => settingsCtrl.runRetention()}
                >
                  {data.saving === "retention-run" ? "Running…" : "Run now"}
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-light/50">
                This section is available to administrators only.
              </div>
            )}
            <Myhr />

            {/* Cloud bridge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SectionTitle text="Cloud bridge (intercept & relay)" />
                <AdminChip />
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="btn-glass px-3 py-1.5 text-sm"
                  disabled={data.saving === "bridge"}
                  onClick={() => settingsCtrl.save("bridge")}
                >
                  {data.saving === "bridge" ? "Saving…" : "Save bridge"}
                </button>
              )}
            </div>
            {isAdmin ? (
              <div className="flex flex-col gap-1">
                <Toggle
                  label="Auto-claim unknown stations from intercepted traffic"
                  value={data.bridge.autoClaim}
                  onChange={(v) =>
                    data.setBridge({ ...data.bridge, autoClaim: v })
                  }
                />
                <TextField
                  label="Auto-claim cap per day (per IP)"
                  type="number"
                  value={String(data.bridge.autoClaimMaxPerDay)}
                  onChange={(v) =>
                    data.setBridge({
                      ...data.bridge,
                      autoClaimMaxPerDay: Number(v),
                    })
                  }
                />
                <Toggle
                  label="Relay captured data to upstream clouds"
                  value={data.bridge.forwardUpstream}
                  onChange={(v) =>
                    data.setBridge({ ...data.bridge, forwardUpstream: v })
                  }
                />
                <TextField
                  label="Upstream Weather Underground URL"
                  value={data.bridge.upstreamWuUrl}
                  onChange={(v) =>
                    data.setBridge({ ...data.bridge, upstreamWuUrl: v })
                  }
                />
                <TextField
                  label="Upstream Ecowitt URL"
                  value={data.bridge.upstreamEcowittUrl}
                  onChange={(v) =>
                    data.setBridge({ ...data.bridge, upstreamEcowittUrl: v })
                  }
                />
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-light/50">
                This section is available to administrators only.
              </div>
            )}
          </>
        )}
      </>
    </Container>
  );
});

export default SettingsView;
