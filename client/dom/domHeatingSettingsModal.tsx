/* eslint-disable jsx-a11y/label-has-associated-control */
import { Dialog, Transition } from "@headlessui/react";
import { observer } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { AppContext } from "..";
import { DOM_ROOM_HEATING_DEFAULTS } from "../../common/domModel";

type Props = {
  appContext: AppContext;
};

const DomHeatingSettingsModal = observer(({ appContext }: Props) => {
  const { domData } = appContext.cCtrl;
  const isOpen = domData.isSettingsOpen;

  const [formPowers, setFormPowers] = useState<Record<string, number>>({ ...domData.roomPowers });

  useEffect(() => {
    if (isOpen) {
      setFormPowers({ ...domData.roomPowers });
    }
  }, [isOpen, domData.roomPowers]);

  function close() {
    domData.setSettingsOpen(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    domData.setRoomPowers(formPowers);
    appContext.cCtrl.fetchDomHeatingData(true);
    close();
  }

  function handleReset() {
    domData.resetRoomPowersToDefault();
    setFormPowers({ ...domData.roomPowers });
    appContext.cCtrl.fetchDomHeatingData(true);
    close();
  }

  const totalKw = Object.values(formPowers).reduce((acc, v) => acc + (v || 0), 0);
  const totalRoomM2 = domData.totalAreaM2;
  const totalHeatedM2 = domData.totalHeatedAreaM2;
  const avgHeatedDensity =
    totalHeatedM2 > 0 ? Math.round((totalKw * 1000) / totalHeatedM2) : 0;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#121621] p-6 text-left align-middle shadow-2xl border border-white/10 transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-base font-bold leading-6 text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>⚡</span> Electric Heating Power Settings
                  </span>
                  <button
                    type="button"
                    onClick={close}
                    className="text-light/40 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </Dialog.Title>

                <p className="mt-2 text-xs text-light/60">
                  Configure installed electric heating cable power (kW) for each room.
                  Power density and consumption calculations will automatically adjust.
                </p>

                <form onSubmit={handleSave} className="mt-4 flex flex-col gap-3">
                  {Object.entries(DOM_ROOM_HEATING_DEFAULTS).map(([roomId, info]) => {
                    const power = formPowers[roomId] ?? info.defaultPowerKw;
                    const roomArea = domData.roomAreas[roomId] ?? info.areaM2;
                    const heatedArea =
                      domData.roomHeatedAreas[roomId] ?? info.heatedAreaM2 ?? roomArea;
                    const density =
                      heatedArea > 0 ? Math.round((power * 1000) / heatedArea) : 0;
                    const watts = Math.round(power * 1000);

                    return (
                      <div
                        key={roomId}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white/90">
                              {info.name}{" "}
                              <span className="text-light/50 font-normal">
                                ({info.slovakName})
                              </span>
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase tracking-wider border ${
                                info.heatingType === "mat"
                                  ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                                  : "bg-blue-500/10 border-blue-500/25 text-blue-300"
                              }`}
                            >
                              {info.heatingType === "mat" ? "Rohož" : "Fólia"}
                            </span>
                          </div>
                          <span className="text-[11px] text-light/50">
                            {roomArea} m² ({heatedArea} m² {info.heatingType === "mat" ? "rohož" : "fólia"}) • {density} W/m² • {watts} W
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.001"
                            min="0.01"
                            max="20"
                            value={power}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setFormPowers((prev) => ({
                                ...prev,
                                [roomId]: Number.isNaN(val) ? 0 : val,
                              }));
                            }}
                            className="glass-input !w-24 text-right !py-1 text-sm font-semibold tabular-nums"
                          />
                          <span className="text-xs font-medium text-light/60">kW</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary row */}
                  <div className="mt-2 p-3 rounded-xl bg-cyan/10 border border-cyan/20 flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-light/80 font-medium">
                        Total Capacity ({totalHeatedM2} m² heat • {avgHeatedDensity} W/m²):
                      </span>
                      <span className="font-bold text-cyan tabular-nums">
                        {totalKw.toFixed(2)} kW ({Math.round(totalKw * 1000)} W)
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-light/60 pt-1.5 border-t border-cyan/15 gap-1">
                      <span>Fólie (8 izieb): {domData.foilsHeatedAreaM2} m² ({domData.foilsCapacityKw.toFixed(2)} kW • ~{Math.round((domData.foilsCapacityKw * 1000) / domData.foilsHeatedAreaM2)} W/m²)</span>
                      <span>Rohože (2 kúpeľne): {domData.matsHeatedAreaM2} m² ({domData.matsCapacityKw.toFixed(2)} kW • ~{Math.round((domData.matsCapacityKw * 1000) / domData.matsHeatedAreaM2)} W/m²)</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-row justify-between items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-light/50 hover:text-white underline"
                    >
                      Reset Defaults
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={close}
                        className="btn-glass !py-1.5 !px-3 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-glass !bg-orange/20 !border-orange/40 hover:!bg-orange/30 text-white font-semibold !py-1.5 !px-4 text-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
});

export default DomHeatingSettingsModal;
