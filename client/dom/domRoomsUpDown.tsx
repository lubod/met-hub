/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { observer } from "mobx-react";
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
      {/* View Switcher Tabs */}
      <div className="flex flex-row items-center justify-between">
        <Text>HEATED ROOMS</Text>
        <div className="flex items-center p-0.5 rounded-lg bg-black/30 border border-white/[0.06] text-xs">
          <button
            type="button"
            className={`segmented-btn !py-1 !px-2.5 ${mode === "all" ? "active" : ""}`}
            onClick={() => domData.setViewMode("all")}
          >
            All (10)
          </button>
          <button
            type="button"
            className={`segmented-btn !py-1 !px-2.5 ${mode === "down" ? "active" : ""}`}
            onClick={() => domData.setViewMode("down")}
          >
            Down (4)
          </button>
          <button
            type="button"
            className={`segmented-btn !py-1 !px-2.5 ${mode === "up" ? "active" : ""}`}
            onClick={() => domData.setViewMode("up")}
          >
            Up (6)
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
            <span className="text-xs font-bold uppercase tracking-wider text-light/70">
              Downstairs Rooms
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
            <span className="text-xs font-bold uppercase tracking-wider text-light/70">
              Upstairs Rooms
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
