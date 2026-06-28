/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Dialog, Transition } from "@headlessui/react";
import { observer } from "mobx-react";
import React, { Fragment, useState } from "react";
import { AppContext } from "..";
import { StationType } from "../../common/stationType";
import Myhr from "../misc/myhr";

type Props = {
  appContext: AppContext;
};

const HeaderModal = observer(({ appContext }: Props) => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [place, setPlace] = useState("");
  const [type, setType] = useState(StationType.GoGenMe3900);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [step2, setStep2] = useState(false);
  const [id, setId] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    const res = await appContext.headerCtrl.addStation({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      type,
      place,
      passkey: passkey.trim() || "dummy",
      id: "",
      measurement: null as any,
      public: true,
      owner: "",
    });
    setError(res.err);
    if (res.id !== "") {
      console.debug(res.id);
      setStep2(true);
      setId(res.id);
    }
  }

  return (
    <Transition
      appear
      show={appContext.headerCtrl.headerData.showModal}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-[100] text-light"
        onClose={() => appContext.headerCtrl.headerData.setShowModal(false)}
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm max-h-screen overflow-auto">
          <div className="flex flex-row justify-center p-4 text-center">
            <Dialog.Panel className="glass transform rounded-2xl p-6 text-left align-middle shadow-xl transition-all max-w-2xl w-full">
              <Dialog.Title as="div" className="text-lg text-light">
                Add new station
              </Dialog.Title>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                  <div className="">Step 1:</div>
                  <div className="text-red">{error}</div>
                </div>

                <form>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col basis-1/2">
                        <label htmlFor="lat">Latitude</label>
                        <input
                          type="text"
                          id="lat"
                          name="lat"
                          className="glass-input w-full"
                          onChange={(e) => setLat(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col basis-1/2">
                        <label htmlFor="lon">Longitude</label>
                        <input
                          type="text"
                          id="lon"
                          name="lon"
                          className="glass-input w-full"
                          onChange={(e) => setLon(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col basis-1/2">
                        <label htmlFor="place">Place</label>
                        <input
                          type="text"
                          id="place"
                          name="place"
                          className="glass-input w-full"
                          onChange={(e) => setPlace(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col basis-1/2">
                        <label htmlFor="type">Type</label>
                        <select
                          id="type"
                          name="type"
                          className="glass-select w-full"
                          onChange={(e) => setType(e.target.value as StationType)}
                        >
                          <option value={StationType.GoGenMe3900}>GoGen Me 3900</option>
                          <option value={StationType.WU}>Weather Underground / Ecowitt</option>
                          <option value={StationType.Json}>JSON Ingestion</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="passkey">Upload Passkey (Required for Weather Underground / Ecowitt / JSON)</label>
                      <input
                        type="text"
                        id="passkey"
                        name="passkey"
                        placeholder="Enter a secure, unique upload passkey"
                        className="glass-input w-full"
                        onChange={(e) => setPasskey(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-row gap-4">
                      <button
                        type="button"
                        className="btn-glass"
                        onClick={() =>
                          appContext.headerCtrl.headerData.setShowModal(false)
                        }
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-glass"
                        onClick={(e) => submit(e)}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>

                {step2 && (
                  <>
                    <Myhr />
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col md:basis-1/2 gap-4">
                        <div className="">Step 2:</div>
                        <div>New station was created with station_id={id}</div>
                        
                        {type === StationType.GoGenMe3900 && (
                          <div>
                            <div>
                              Follow these steps to configure data upload from your
                              station to www.met-hub.com:
                            </div>
                            <div className="mt-2 text-sm space-y-1">
                              <li>Open WS View application on your phone/tablet</li>
                              <li>Choose your device</li>
                              <li>Go to customized data upload</li>
                              <li>Customized: Enable</li>
                              <li>Protocol type same as: Ecowitt</li>
                              <li>Server IP / Hostname: www.met-hub.com</li>
                              <li>Path: /setData/{id}</li>
                              <li>Port: 80</li>
                              <li>Upload interval: 16 Seconds</li>
                              <li>Save & Finish</li>
                            </div>
                          </div>
                        )}

                        {type === StationType.WU && (
                          <div>
                            <div>
                              Configure customized upload to www.met-hub.com:
                            </div>
                            <div className="mt-2 text-sm space-y-1 text-light/90">
                              <p className="font-semibold text-sky-400">Option A: Ecowitt Custom Server</p>
                              <li className="pl-2">Protocol: Ecowitt</li>
                              <li className="pl-2">Server: www.met-hub.com</li>
                              <li className="pl-2">Path: /data/report</li>
                              <li className="pl-2">PASSKEY: {passkey || "(your-passkey)"}</li>
                              
                              <p className="font-semibold text-sky-400 mt-2">Option B: Weather Underground Protocol</p>
                              <li className="pl-2">Protocol: Wunderground</li>
                              <li className="pl-2">Server: www.met-hub.com</li>
                              <li className="pl-2">Path: /weatherstation/updateweatherstation.php</li>
                              <li className="pl-2">Station ID: {passkey || "(your-passkey)"}</li>
                              <li className="pl-2">Port: 80</li>
                            </div>
                          </div>
                        )}

                        {type === StationType.Json && (
                          <div>
                            <div>
                              Send HTTP POST requests to the ingestion endpoint:
                            </div>
                            <div className="mt-2 text-sm space-y-2 bg-black/40 p-3 rounded-lg border border-white/10 font-mono">
                              <p className="text-sky-400">POST http://www.met-hub.com/api/ingest/{id}</p>
                              <p className="text-amber-400">Headers: {"{"} &quot;x-passkey&quot;: &quot;{passkey || "(your-passkey)"}&quot; {"}"}</p>
                              <p className="text-xs text-light/70 mt-1">Payload format: JSON containing metric values (temp, humidity, windspeed, rainrate, pressurerel, etc.)</p>
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          className="btn-glass mt-4"
                          onClick={() =>
                            appContext.headerCtrl.headerData.setShowModal(false)
                          }
                        >
                          Done
                        </button>
                      </div>
                      <div className="flex flex-col md:basis-1/2 place-items-center">
                        <img src="station-setup.jpg" alt="" width={230} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
});

export default HeaderModal;
