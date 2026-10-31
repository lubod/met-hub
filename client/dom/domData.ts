import { action, computed, makeObservable, observable } from "mobx";
import {
  IDomData,
  IDomTrendData,
  IDomHeatingStats,
  DOM_ROOM_HEATING_DEFAULTS,
} from "../../common/domModel";
import { IStation } from "../../common/allStationsCfg";

const STORAGE_KEY_ROOM_POWERS = "met_hub_dom_room_powers_v2";

class DomData {
  data: IDomData = {} as IDomData;

  trendData: IDomTrendData = {
    timestamp: [],
    temp: [],
    humidity: [],
    rain: [],
    tarif: [],
    living_room_air: [],
    living_room_floor: [],
    guest_room_air: [],
    guest_room_floor: [],
    bed_room_air: [],
    bed_room_floor: [],
    boys_room_air: [],
    boys_room_floor: [],
    petra_room_air: [],
    petra_room_floor: [],
  } as IDomTrendData;

  ctime: Date = new Date();

  oldData: boolean = true;

  loading: boolean = true;

  station: IStation | null = null;

  // View mode: 'all' | 'down' | 'up' (default 'all')
  viewMode: "all" | "down" | "up" = "all";

  // Retain legacy upDown for backward-compat
  upDown = false;

  // Heating power (kW) configuration per room (exact user wattages: 6907 W total)
  roomPowers: Record<string, number> = {
    living_room: 2.254, // obyvacka: 2254 W
    guest_room: 0.665,  // hostovska: 665 W
    entry_hall: 0.329,  // vstupna chodba: 329 W
    bath_down: 0.506,   // kupelna dole: 506 W
    boys_room: 0.984,   // chalani: 984 W
    petra_room: 0.672,  // petra: 672 W
    bed_room: 0.577,    // spalna: 577 W
    bath_up: 0.541,     // kupelna hore: 541 W
    wardrobe: 0.132,    // satnik: 132 W
    hall_up: 0.247,     // chodba hore: 247 W
  };

  // Room area (m²) as specified by user (living 40, pracovna 13, chalani 20, petra 13, spalna 12 + aux)
  roomAreas: Record<string, number> = {
    living_room: 40,
    guest_room: 13,
    entry_hall: 4,
    bath_down: 5,
    boys_room: 20,
    petra_room: 13,
    bed_room: 12,
    bath_up: 5,
    wardrobe: 2,
    hall_up: 3,
  };

  heatingStats: IDomHeatingStats | null = null;

  heatingInterval: "today" | "yesterday" | "last24h" | "last7d" | "last30d" = "today";

  isSettingsOpen: boolean = false;

  constructor() {
    this.loadSavedPowers();

    makeObservable(this, {
      data: observable,
      trendData: observable,
      oldData: observable,
      loading: observable,
      upDown: observable,
      viewMode: observable,
      roomPowers: observable,
      roomAreas: observable,
      heatingStats: observable,
      heatingInterval: observable,
      isSettingsOpen: observable,
      activePowerKw: computed,
      totalCapacityKw: computed,
      activeRoomsCount: computed,
      totalAreaM2: computed,
      processData: action,
      processTrendData: action,
      processHeatingStats: action,
      checkOldData: action,
      setLoading: action,
      setUpDown: action,
      setViewMode: action,
      setHeatingInterval: action,
      setRoomPower: action,
      setRoomPowers: action,
      resetRoomPowersToDefault: action,
      setSettingsOpen: action,
    });
  }

  loadSavedPowers() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY_ROOM_POWERS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "object" && parsed !== null) {
            this.roomPowers = { ...this.roomPowers, ...parsed };
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load saved room powers:", e);
    }
  }

  savePowers() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY_ROOM_POWERS, JSON.stringify(this.roomPowers));
      }
    } catch (e) {
      console.warn("Failed to save room powers:", e);
    }
  }

  get activePowerKw(): number {
    let sum = 0;
    if (this.data.living_room_heat) sum += this.roomPowers.living_room || 0;
    if (this.data.guest_room_heat) sum += this.roomPowers.guest_room || 0;
    if (this.data.entry_hall_heat) sum += this.roomPowers.entry_hall || 0;
    if (this.data.bath_down_heat) sum += this.roomPowers.bath_down || 0;
    if (this.data.boys_room_heat) sum += this.roomPowers.boys_room || 0;
    if (this.data.petra_room_heat) sum += this.roomPowers.petra_room || 0;
    if (this.data.bed_room_heat) sum += this.roomPowers.bed_room || 0;
    if (this.data.bath_up_heat) sum += this.roomPowers.bath_up || 0;
    if (this.data.wardrobe_heat) sum += this.roomPowers.wardrobe || 0;
    if (this.data.hall_up_heat) sum += this.roomPowers.hall_up || 0;
    return Math.round(sum * 100) / 100;
  }

  get totalCapacityKw(): number {
    const sum = Object.values(this.roomPowers).reduce((acc, v) => acc + (v || 0), 0);
    return Math.round(sum * 100) / 100;
  }

  get activeRoomsCount(): number {
    let count = 0;
    if (this.data.living_room_heat) count += 1;
    if (this.data.guest_room_heat) count += 1;
    if (this.data.entry_hall_heat) count += 1;
    if (this.data.bath_down_heat) count += 1;
    if (this.data.boys_room_heat) count += 1;
    if (this.data.petra_room_heat) count += 1;
    if (this.data.bed_room_heat) count += 1;
    if (this.data.bath_up_heat) count += 1;
    if (this.data.wardrobe_heat) count += 1;
    if (this.data.hall_up_heat) count += 1;
    return count;
  }

  get totalAreaM2(): number {
    return Object.values(this.roomAreas).reduce((acc, v) => acc + (v || 0), 0);
  }

  getPowersQueryString(): string {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(this.roomPowers)) {
      if (v != null) params.set(k, String(v));
    }
    return params.toString();
  }

  setRoomPower(roomId: string, powerKw: number) {
    this.roomPowers[roomId] = Math.max(0.01, Math.min(20, powerKw));
    this.savePowers();
  }

  setRoomPowers(powers: Record<string, number>) {
    this.roomPowers = { ...this.roomPowers, ...powers };
    this.savePowers();
  }

  resetRoomPowersToDefault() {
    const defaults: Record<string, number> = {};
    for (const [k, v] of Object.entries(DOM_ROOM_HEATING_DEFAULTS)) {
      defaults[k] = v.defaultPowerKw;
    }
    this.roomPowers = defaults;
    this.savePowers();
  }

  setViewMode(mode: "all" | "down" | "up") {
    this.viewMode = mode;
    this.upDown = mode === "up";
  }

  setHeatingInterval(interval: "today" | "yesterday" | "last24h" | "last7d" | "last30d") {
    this.heatingInterval = interval;
  }

  setSettingsOpen(open: boolean) {
    this.isSettingsOpen = open;
  }

  processHeatingStats(stats: IDomHeatingStats) {
    if (stats != null) {
      this.heatingStats = stats;
    }
  }

  setUpDown(upDown: boolean) {
    this.upDown = upDown;
    this.viewMode = upDown ? "up" : "down";
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setStation(station: IStation | null) {
    this.station = station;
    this.ctime = new Date();
    this.oldData = true;
    this.loading = true;
  }

  checkOldData(time: Date) {
    if (this.data.timestamp) {
      const timestamp = new Date(this.data.timestamp);
      const diff = time.getTime() - timestamp.getTime();
      if (diff > 300000) {
        this.oldData = true;
      } else {
        this.oldData = false;
      }
    } else {
      this.oldData = true;
    }
  }

  processData(newData: IDomData) {
    if (newData != null) {
      this.data = newData;
      this.checkOldData(new Date());
    }
    this.loading = false;
  }

  processTrendData(newTrendData: IDomTrendData) {
    if (newTrendData != null) {
      this.trendData = newTrendData;
    }
  }
}

export default DomData;
