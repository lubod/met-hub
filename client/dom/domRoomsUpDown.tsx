/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { observer } from "mobx-react";
import { Switch } from "@headlessui/react";
import { AppContext } from "..";
import Text from "../misc/text";
import DomRoomsUp from "./domRoomsUp";
import DomRoomsDown from "./domRoomsDown";

type Props = {
  appContext: AppContext;
};

const DomRoomsUpDown = observer(({ appContext }: Props) => {
  const { domData } = appContext.cCtrl;
  const mode = domData.viewMode;

  const downM2 =
    (domData.roomAreas.living_room || 0) +
    (domData.roomAreas.guest_room || 0) +
    (domData.roomAreas.entry_hall || 0) +
    (domData.roomAreas.bath_down || 0);
  const downKw =
    (domData.roomPowers.living_room || 0) +
    (domData.roomPowers.guest_room || 0) +
    (domData.roomPowers.entry_hall || 0) +
    (domData.roomPowers.bath_down || 0);

  const upM2 =
    (domData.roomAreas.bed_room || 0) +
    (domData.roomAreas.boys_room || 0) +
    (domData.roomAreas.petra_room || 0) +
    (domData.roomAreas.bath_up || 0) +
    (domData.roomAreas.wardrobe || 0) +
    (domData.roomAreas.hall_up || 0);
  const upKw =
    (domData.roomPowers.bed_room || 0) +
    (domData.roomPowers.boys_room || 0) +
    (domData.roomPowers.petra_room || 0) +
    (domData.roomPowers.bath_up || 0) +
    (domData.roomPowers.wardrobe || 0) +
    (domData.roomPowers.hall_up || 0);

  return (
    <div className="flex flex-col gap-4">
      {/* View Switcher Tabs & Toggle */}
      <div className="flex flex-row items-center justify-between flex-wrap gap-2.5">
        <Text>HEATED ROOMS</Text>

        <div className="flex items-center gap-2">
          {/* DOWN / UP Interactive Toggle Switch */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 border border-white/[0.08] shadow-inner">
            <button
              type="button"
              className={`text-xs font-bold tracking-wide transition-colors flex items-center gap-1 ${
                mode === "down"
                  ? "text-cyan"
                  : "text-light/50 hover:text-white"
              }`}
              onClick={() => domData.setUpDown(false)}
            >
              <span>⬇️</span>
              <span>DOWN</span>
            </button>

            <Switch
              checked={domData.upDown}
              onChange={(val) => domData.setUpDown(val)}
              className={`${
                domData.upDown
                  ? "bg-orange/30 border-orange/50"
                  : "bg-cyan/30 border-cyan/50"
              } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none`}
              title="Toggle between Downstairs and Upstairs"
            >
              <span className="sr-only">Toggle Down and Up</span>
              <span
                className={`${
                  domData.upDown
                    ? "translate-x-5 bg-orange shadow-[0_0_6px_#e07856]"
                    : "translate-x-0.5 bg-cyan shadow-[0_0_6px_#6ba3a8]"
                } pointer-events-none inline-block h-3.5 w-3.5 my-auto transform rounded-full shadow transition duration-200 ease-in-out`}
              />
            </Switch>

            <button
              type="button"
              className={`text-xs font-bold tracking-wide transition-colors flex items-center gap-1 ${
                mode === "up"
                  ? "text-orange"
                  : "text-light/50 hover:text-white"
              }`}
              onClick={() => domData.setUpDown(true)}
            >
              <span>UP</span>
              <span>⬆️</span>
            </button>
          </div>

          {/* ALL (10) view button */}
          <button
            type="button"
            className={`segmented-btn !py-1 !px-2.5 text-xs ${mode === "all" ? "active" : ""}`}
            onClick={() => domData.setViewMode("all")}
            title="Show all 10 rooms"
          >
            All (10)
          </button>
        </div>
      </div>

      {/* Column Legends (Desktop) */}
      <div className="hidden md:flex flex-row text-[11px] font-semibold uppercase tracking-wider text-light/40 px-3 py-1 border-b border-white/5">
        <div className="basis-1/4 text-center">Air (°C)</div>
        <div className="basis-1/4 text-center">Floor (°C)</div>
        <div className="basis-1/4 text-center">Target (°C)</div>
        <div className="basis-1/4 text-center">Active (kW)</div>
      </div>

      {/* Content Rendering */}
      {mode === "all" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-light/70 flex items-center gap-1.5">
              <span>⬇️</span> Downstairs
            </span>
            <span className="text-[11px] text-light/40 font-medium">
              {downM2} m² • {downKw.toFixed(2)} kW
            </span>
          </div>
          <DomRoomsDown appContext={appContext} />

          <div className="flex items-center justify-between px-1 pt-3 border-t border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-light/70 flex items-center gap-1.5">
              <span>⬆️</span> Upstairs
            </span>
            <span className="text-[11px] text-light/40 font-medium">
              {upM2} m² • {upKw.toFixed(2)} kW
            </span>
          </div>
          <DomRoomsUp appContext={appContext} />
        </div>
      )}

      {mode === "down" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-light/70 flex items-center gap-1.5">
              <span>⬇️</span> Downstairs (4 rooms)
            </span>
            <span className="text-[11px] text-light/40 font-medium">
              {downM2} m² • {downKw.toFixed(2)} kW
            </span>
          </div>
          <DomRoomsDown appContext={appContext} />
        </div>
      )}

      {mode === "up" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-light/70 flex items-center gap-1.5">
              <span>⬆️</span> Upstairs (6 rooms)
            </span>
            <span className="text-[11px] text-light/40 font-medium">
              {upM2} m² • {upKw.toFixed(2)} kW
            </span>
          </div>
          <DomRoomsUp appContext={appContext} />
        </div>
      )}
    </div>
  );
});

export default DomRoomsUpDown;
