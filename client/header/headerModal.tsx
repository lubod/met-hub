/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Dialog, Transition } from "@headlessui/react";
import { observer } from "mobx-react";
import React, { Fragment, useState } from "react";
import { AppContext } from "..";
import Myhr from "../misc/myhr";

type Props = {
  appContext: AppContext;
};

const HeaderModal = observer(({ appContext }: Props) => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [place, setPlace] = useState("");
  const [type, setType] = useState("GoGen Me 3900");
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
      passkey: null,
      id: null,
      measurement: null,
      public: true,
      owner: null,
    });
    setError(res.err);
    if (res.id !== "") {
      console.info(res.id);
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
        className="relative z-10 bg-black text-light"
        onClose={() => appContext.headerCtrl.headerData.setShowModal(false)}
      >
        <div className="fixed inset-0 bg-dark max-h-screen overflow-auto">
          <div className="flex flex-row justify-center p-4 text-center">
            <Dialog.Panel className="transform rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
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
                          className="bg-blue text-light p-1 rounded-md"
                          onChange={(e) => setLat(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col basis-1/2">
                        <label htmlFor="lon">Longitude</label>
                        <input
                          type="text"
                          id="lon"
                          name="lon"
                          className="bg-blue text-light p-1 rounded-md"
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
                          className="bg-blue text-light p-1 rounded-md"
                          onChange={(e) => setPlace(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col basis-1/2">
                        <label htmlFor="type">Type</label>
                        <select
                          id="type"
                          name="type"
                          className="bg-blue text-light p-1 rounded-md"
                          onChange={(e) => setType(e.target.value)}
                        >
                          <option value="GoGen Me 3900">GoGen Me 3900</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4">
                      <button
                        type="button"
                        className="bg-blue text-light flex items-center rounded-md p-1 hover:bg-blue2"
                        onClick={() =>
                          appContext.headerCtrl.headerData.setShowModal(false)
                        }
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="bg-blue text-light flex items-center rounded-md p-1 hover:bg-blue2"
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
                        <div>
                          Follow these steps to configure data upload from your
                          station to www.met-hub.com according to the picture:
                        </div>
                        <div>
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
                          <li>Click Done button bellow</li>
                        </div>
                        <button
                          type="button"
                          className="bg-blue text-light flex w-12 items-center rounded-md p-1 hover:bg-blue2"
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
